import { async, TestBed } from '@angular/core/testing';

import { ChargeTypeEditComponent } from './charge-type-edit.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeTypeService } from '../charge-type.service';
import { ErrorService } from '../error.service';
import { NgModule } from '@angular/core';
import { ChargeTypeModel } from '../models/charge-type.model';
import { of } from 'rxjs';

describe('ChargeTypeEditComponent', () => {

  const chargeCategories = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A' }
  ];
  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);

  @NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule],
    declarations: [ChargeTypeEditComponent],
    providers: [
      { provide: Router, useValue: fakeRouter },
      ChargeTypeService,
      ErrorService
    ]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { chargeCategories } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvelle nature des charges');
    });

    it('should expose sorted charge categories', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.chargeCategories.map(t => t.name)).toEqual(['A', 'B']);
    });

    it('should expose a default charge type', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.chargeType).toEqual({ name: '', categoryId: null, maxMonthlyAmount: null });
    });

    it('should display the charge type in a form, and have the save button disabled', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        expect(name.value).toBe('');

        const category: HTMLSelectElement = nativeElement.querySelector('#category');
        expect(category.selectedIndex).toBe(-1);
        expect(category.options.length).toBe(chargeCategories.length + 1);

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        expect(maxMonthlyAmount.value).toBe('');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(true);
      });
    });

    it('should save the charge type and navigate to the list', () => {
      const chargeTypeService = TestBed.get(ChargeTypeService);
      const router = TestBed.get(Router);

      spyOn(chargeTypeService, 'create').and.returnValue(of({
        id: 42
      }));

      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        name.value = 'foo';
        name.dispatchEvent(new Event('input'));

        const category: HTMLSelectElement = nativeElement.querySelector('#category');
        category.selectedIndex = 1;
        category.dispatchEvent(new Event('change'));

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        maxMonthlyAmount.value = '123';
        maxMonthlyAmount.dispatchEvent(new Event('input'));

        const save = nativeElement.querySelector('#save');
        fixture.detectChanges();

        expect(save.disabled).toBe(false);

        save.click();

        expect(chargeTypeService.create).toHaveBeenCalledWith({ name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/charge-types']);
      });
    });
  });

  describe('in edition mode', () => {
    const chargeType: ChargeTypeModel = {
      id: 42,
      name: 'foo',
      category: { id: 2, name: 'A' },
      maxMonthlyAmount: 123
    };
    const activatedRoute = {
      snapshot: { data: { chargeType, chargeCategories } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de la nature des charges foo');
    });

    it('should expose the edited charge type info', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.chargeType).toEqual({ name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the charge type in a form, and have the save button enabled', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        expect(name.value).toBe('foo');

        const category: HTMLSelectElement = nativeElement.querySelector('#category');
        expect(category.selectedIndex).toBe(1);

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        expect(maxMonthlyAmount.value).toBe('123');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(false);
      });
    });

    it('should save the charge type and navigate to the charge types page', () => {
      const chargeTypeService = TestBed.get(ChargeTypeService);
      const router = TestBed.get(Router);

      spyOn(chargeTypeService, 'update').and.returnValue(of(null));

      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        const save = nativeElement.querySelector('#save');
        save.click();

        expect(chargeTypeService.update).toHaveBeenCalledWith(42, { name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/charge-types']);
      });
    });
  });
});

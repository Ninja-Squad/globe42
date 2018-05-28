import { async, TestBed } from '@angular/core/testing';

import { ChargeTypeEditComponent } from './charge-type-edit.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeTypeService } from '../charge-type.service';
import { ErrorService } from '../error.service';
import { NgModule } from '@angular/core';
import { ChargeTypeModel } from '../models/charge-type.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChargeTypeEditComponent', () => {

  const chargeCategories = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A' }
  ];

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    declarations: [ChargeTypeEditComponent],
    providers: [
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
      expect(component.chargeTypeForm.value).toEqual({ name: '', categoryId: null, maxMonthlyAmount: null });
    });

    it('should display the charge type in a form, and validate the form', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      expect(name.value).toBe('');

      const category: HTMLSelectElement = element.querySelector('#category');
      expect(category.selectedIndex).toBe(-1);
      expect(category.options.length).toBe(chargeCategories.length + 1);

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      expect(maxMonthlyAmount.value).toBe('');
      maxMonthlyAmount.value = '0';
      maxMonthlyAmount.dispatchEvent(new Event('input'));

      const chargeTypeService: ChargeTypeService = TestBed.get(ChargeTypeService);

      spyOn(chargeTypeService, 'create');

      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('Le nom est obligatoire');
      expect(element.textContent).toContain('La dépense est obligatoire');
      expect(element.textContent).toContain('Le montant mensuel maximum doit être positif');

      expect(chargeTypeService.create).not.toHaveBeenCalled();
    });

    it('should save the charge type and navigate to the list', () => {
      const chargeTypeService: ChargeTypeService = TestBed.get(ChargeTypeService);
      const router: Router = TestBed.get(Router);

      spyOn(chargeTypeService, 'create').and.returnValue(of({
        id: 42
      }));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      name.value = 'foo';
      name.dispatchEvent(new Event('input'));

      const category: HTMLSelectElement = element.querySelector('#category');
      category.selectedIndex = 1;
      category.dispatchEvent(new Event('change'));

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      maxMonthlyAmount.value = '123';
      maxMonthlyAmount.dispatchEvent(new Event('input'));

      const save: HTMLButtonElement = element.querySelector('#save');
      fixture.detectChanges();

      save.click();

      expect(chargeTypeService.create).toHaveBeenCalledWith({ name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/charge-types']);
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
      expect(component.chargeTypeForm.value).toEqual({ name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the charge type in a form', () => {
      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      expect(name.value).toBe('foo');

      const category: HTMLSelectElement = element.querySelector('#category');
      expect(category.selectedIndex).toBe(1);

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      expect(maxMonthlyAmount.value).toBe('123');
    });

    it('should save the charge type and navigate to the charge types page', () => {
      const chargeTypeService: ChargeTypeService = TestBed.get(ChargeTypeService);
      const router: Router = TestBed.get(Router);

      spyOn(chargeTypeService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(ChargeTypeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();

      expect(chargeTypeService.update).toHaveBeenCalledWith(42, { name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/charge-types']);
    });
  });
});

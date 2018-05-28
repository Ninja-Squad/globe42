import { async, TestBed } from '@angular/core/testing';

import { IncomeSourceEditComponent } from './income-source-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeSourceService } from '../income-source.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('IncomeSourceEditComponent', () => {

  const incomeSourceTypes = [
    { id: 1, type: 'B' },
    { id: 2, type: 'A' }
  ];

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    declarations: [IncomeSourceEditComponent]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { incomeSourceTypes } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvelle nature de prestation');
    });

    it('should expose sorted income source types', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSourceTypes.map(t => t.type)).toEqual(['A', 'B']);
    });

    it('should expose a default income source', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSourceForm.value).toEqual({ name: '', typeId: null, maxMonthlyAmount: null });
    });

    it('should display the income source in a form, and validate the form', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      expect(name.value).toBe('');

      const type: HTMLSelectElement = element.querySelector('#type');
      expect(type.selectedIndex).toBe(-1);
      expect(type.options.length).toBe(incomeSourceTypes.length + 1);

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      expect(maxMonthlyAmount.value).toBe('');
      maxMonthlyAmount.value = '0';
      maxMonthlyAmount.dispatchEvent(new Event('input'));

      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);

      spyOn(incomeSourceService, 'create');
      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('Le nom est obligatoire');
      expect(element.textContent).toContain(`L'organisme payeur est obligatoire`);
      expect(element.textContent).toContain('Le montant mensuel maximum doit être positif');

      expect(incomeSourceService.create).not.toHaveBeenCalled();
    });

    it('should save the income source and navigate to the list', () => {
      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);
      const router: Router = TestBed.get(Router);

      spyOn(incomeSourceService, 'create').and.returnValue(of({
        id: 42
      }));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      name.value = 'foo';
      name.dispatchEvent(new Event('input'));

      const type: HTMLSelectElement = element.querySelector('#type');
      type.selectedIndex = 1;
      type.dispatchEvent(new Event('change'));

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      maxMonthlyAmount.value = '123';
      maxMonthlyAmount.dispatchEvent(new Event('input'));

      const save: HTMLButtonElement = element.querySelector('#save');
      fixture.detectChanges();

      expect(save.disabled).toBe(false);

      save.click();

      expect(incomeSourceService.create).toHaveBeenCalledWith({ name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/income-sources']);
    });
  });

  describe('in edition mode', () => {
    const incomeSource: IncomeSourceModel = {
      id: 42,
      name: 'foo',
      type: { id: 2, type: 'A' },
      maxMonthlyAmount: 123
    };
    const activatedRoute = {
      snapshot: { data: { incomeSource, incomeSourceTypes } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de la nature de prestation foo');
    });

    it('should expose the edited income source info', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSourceForm.value).toEqual({ name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the income source in a form, and have the save button enabled', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const name: HTMLInputElement = element.querySelector('#name');
      expect(name.value).toBe('foo');

      const type: HTMLSelectElement = element.querySelector('#type');
      expect(type.selectedIndex).toBe(1);

      const maxMonthlyAmount: HTMLInputElement = element.querySelector('#maxMonthlyAmount');
      expect(maxMonthlyAmount.value).toBe('123');
    });

    it('should save the income source and navigate to the income sources page', () => {
      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);
      const router: Router = TestBed.get(Router);

      spyOn(incomeSourceService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const nativeElement: HTMLElement = fixture.nativeElement;
      const save: HTMLButtonElement = nativeElement.querySelector('#save');
      save.click();

      expect(incomeSourceService.update).toHaveBeenCalledWith(42, { name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/income-sources']);
    });
  });
});


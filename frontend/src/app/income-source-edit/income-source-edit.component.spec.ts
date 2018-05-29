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
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';

class IncomeSourceEditComponentTester extends ComponentTester<IncomeSourceEditComponent> {
  constructor() {
    super(IncomeSourceEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get name() {
    return this.input('#name');
  }

  get type() {
    return this.select('#type');
  }

  get maxMonthlyAmount() {
    return this.input('#maxMonthlyAmount');
  }

  get save() {
    return this.button('#save');
  }
}

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

  beforeEach(() => jasmine.addMatchers(speculoosMatchers));

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { incomeSourceTypes } }
    };
    let tester: IncomeSourceEditComponentTester;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute }
        ]
      });

      tester = new IncomeSourceEditComponentTester();
      tester.detectChanges();
    }));

    it('should have a title', () => {
      expect(tester.title).toContainText('Nouvelle nature de prestation');
    });

    it('should expose sorted income source types', () => {
      expect(tester.componentInstance.incomeSourceTypes.map(t => t.type)).toEqual(['A', 'B']);
    });

    it('should expose a default income source', () => {
      expect(tester.componentInstance.incomeSourceForm.value).toEqual({ name: '', typeId: null, maxMonthlyAmount: null });
    });

    it('should display the income source in a form, and validate the form', () => {
      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);
      spyOn(incomeSourceService, 'create');

      expect(tester.name).toHaveValue('');
      expect(tester.type.selectedLabel).toBeNull();
      expect(tester.type.optionValues.length).toBe(incomeSourceTypes.length + 1);
      expect(tester.maxMonthlyAmount).toHaveValue('');

      tester.maxMonthlyAmount.fillWith('0');
      tester.save.click();

      expect(tester.testElement).toContainText('Le nom est obligatoire');
      expect(tester.testElement).toContainText(`L'organisme payeur est obligatoire`);
      expect(tester.testElement).toContainText('Le montant mensuel maximum doit être positif');

      expect(incomeSourceService.create).not.toHaveBeenCalled();
    });

    it('should save the income source and navigate to the list', () => {
      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);
      const router: Router = TestBed.get(Router);
      spyOn(incomeSourceService, 'create').and.returnValue(of({
        id: 42
      }));
      spyOn(router, 'navigate');

      tester.name.fillWith('foo');
      tester.type.selectIndex(1);
      tester.maxMonthlyAmount.fillWith('123');
      tester.save.click();

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
    let tester: IncomeSourceEditComponentTester;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute },
        ]
      });

      tester = new IncomeSourceEditComponentTester();
      tester.detectChanges();
    }));

    it('should have a title', () => {
      expect(tester.title).toContainText('Modification de la nature de prestation foo');
    });

    it('should expose the edited income source info', () => {
      expect(tester.componentInstance.incomeSourceForm.value).toEqual({ name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the income source in a form, and have the save button enabled', () => {
      expect(tester.name).toHaveValue('foo');
      expect(tester.type).toHaveSelectedLabel('A');
      expect(tester.maxMonthlyAmount).toHaveValue('123');
    });

    it('should save the income source and navigate to the income sources page', () => {
      const incomeSourceService: IncomeSourceService = TestBed.get(IncomeSourceService);
      const router: Router = TestBed.get(Router);
      spyOn(incomeSourceService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(incomeSourceService.update).toHaveBeenCalledWith(42, { name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/income-sources']);
    });
  });
});


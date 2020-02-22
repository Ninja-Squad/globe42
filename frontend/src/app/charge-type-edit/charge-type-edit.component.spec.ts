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
import { ComponentTester, speculoosMatchers } from 'ngx-speculoos';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';

class ChargeTypeEditComponentTester extends ComponentTester<ChargeTypeEditComponent> {
  constructor() {
    super(ChargeTypeEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get name() {
    return this.input('#name');
  }

  get category() {
    return this.select('#category');
  }

  get maxMonthlyAmount() {
    return this.input('#maxMonthlyAmount');
  }

  get save() {
    return this.button('#save');
  }
}

describe('ChargeTypeEditComponent', () => {

  const chargeCategories = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A' }
  ];

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, ValdemortModule],
    declarations: [ChargeTypeEditComponent, ValidationDefaultsComponent, PageTitleDirective],
    providers: [
      ChargeTypeService,
      ErrorService
    ]
  })
  class TestModule {}

  beforeEach(() => jasmine.addMatchers(speculoosMatchers));

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { chargeCategories } }
    };

    let tester: ChargeTypeEditComponentTester;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute }
        ]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      tester = new ChargeTypeEditComponentTester();
      tester.detectChanges();
    }));

    it('should have a title', () => {
      expect(tester.title).toContainText('Nouvelle nature des charges');
    });

    it('should expose sorted charge categories', () => {
      expect(tester.componentInstance.chargeCategories.map(t => t.name)).toEqual(['A', 'B']);
    });

    it('should expose a default charge type', () => {
      expect(tester.componentInstance.chargeTypeForm.value).toEqual({ name: '', categoryId: null, maxMonthlyAmount: null });
    });

    it('should display the charge type in a form, and validate the form', () => {
      expect(tester.name).toHaveValue('');
      expect(tester.category.optionLabels).toEqual(['', 'A', 'B']);
      expect(tester.category).toHaveSelectedLabel('');
      expect(tester.maxMonthlyAmount).toHaveValue('');

      tester.maxMonthlyAmount.fillWith('0');

      const chargeTypeService: ChargeTypeService = TestBed.inject(ChargeTypeService);
      spyOn(chargeTypeService, 'create');

      expect(tester.testElement).not.toContainText('Le nom est obligatoire');
      expect(tester.testElement).not.toContainText('La dépense est obligatoire');
      expect(tester.testElement).not.toContainText('Le montant mensuel maximum doit être positif');

      tester.save.click();

      expect(tester.testElement).toContainText('Le nom est obligatoire');
      expect(tester.testElement).toContainText('La dépense est obligatoire');
      expect(tester.testElement).toContainText('Le montant mensuel maximum doit être positif');

      expect(chargeTypeService.create).not.toHaveBeenCalled();
    });

    it('should save the charge type and navigate to the list', () => {
      const chargeTypeService: ChargeTypeService = TestBed.inject(ChargeTypeService);
      const router: Router = TestBed.inject(Router);
      spyOn(chargeTypeService, 'create').and.returnValue(of({
        id: 42
      } as ChargeTypeModel));
      spyOn(router, 'navigate');

      tester.name.fillWith('foo');
      tester.category.selectIndex(1);
      tester.maxMonthlyAmount.fillWith('123');
      tester.save.click();

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
    let tester: ChargeTypeEditComponentTester;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute },
        ]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      tester = new ChargeTypeEditComponentTester();
      tester.detectChanges();
    }));

    it('should have a title', () => {
      expect(tester.title).toContainText('Modification de la nature des charges foo');
    });

    it('should expose the edited charge type info', () => {
      expect(tester.componentInstance.chargeTypeForm.value).toEqual({ name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the charge type in a form', () => {
      expect(tester.name).toHaveValue('foo');
      expect(tester.category).toHaveSelectedLabel('A');
      expect(tester.maxMonthlyAmount).toHaveValue('123');
    });

    it('should save the charge type and navigate to the charge types page', () => {
      const chargeTypeService: ChargeTypeService = TestBed.inject(ChargeTypeService);
      const router: Router = TestBed.inject(Router);
      spyOn(chargeTypeService, 'update').and.returnValue(of(null));
      spyOn(router, 'navigate');

      tester.save.click();

      expect(chargeTypeService.update).toHaveBeenCalledWith(42, { name: 'foo', categoryId: 2, maxMonthlyAmount: 123 });
      expect(router.navigate).toHaveBeenCalledWith(['/charge-types']);
    });
  });
});

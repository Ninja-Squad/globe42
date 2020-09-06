import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeTypeEditComponent } from './income-type-edit.component';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentTester } from 'ngx-speculoos';

class IncomeTypeEditComponentTester extends ComponentTester<IncomeTypeEditComponent> {
  constructor() {
    super(IncomeTypeEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get type() {
    return this.input('#type');
  }

  get save() {
    return this.button('#save');
  }
}

describe('IncomeTypeEditComponent', () => {
  @NgModule({
    imports: [
      CommonModule,
      HttpClientTestingModule,
      ReactiveFormsModule,
      RouterTestingModule,
      ValdemortModule
    ],
    declarations: [IncomeTypeEditComponent, ValidationDefaultsComponent, PageTitleDirective]
  })
  class TestModule {}

  let tester: IncomeTypeEditComponentTester;

  describe('in edit mode', () => {
    const incomeType: IncomeSourceTypeModel = { id: 42, type: 'CAF' };
    const activatedRoute = {
      snapshot: { data: { incomeType } }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      tester = new IncomeTypeEditComponentTester();
    });

    it('should have a title', () => {
      tester.detectChanges();
      expect(tester.title).toContainText(`Modification de l'organisme payeur CAF`);
    });

    it('should edit and update an existing income type', () => {
      const incomeSourceTypeService: IncomeSourceTypeService = TestBed.inject(
        IncomeSourceTypeService
      );
      spyOn(incomeSourceTypeService, 'update').and.returnValue(of(undefined));
      const router: Router = TestBed.inject(Router);
      spyOn(router, 'navigateByUrl');

      tester.detectChanges();

      expect(tester.componentInstance.incomeTypeForm.value).toEqual({ type: 'CAF' });

      expect(tester.type).toHaveValue('CAF');

      tester.type.fillWith('Caisse Allocations Familiales');
      tester.save.click();

      expect(incomeSourceTypeService.update).toHaveBeenCalledWith(42, {
        type: 'Caisse Allocations Familiales'
      });

      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    });
  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      tester = new IncomeTypeEditComponentTester();
    });

    it('should have a title', () => {
      tester.detectChanges();
      expect(tester.title).toContainText('Nouvel organisme payeur');
    });

    it('should create and save a new income type', () => {
      const incomeSourceTypeService = TestBed.inject(IncomeSourceTypeService);
      const router: Router = TestBed.inject(Router);

      spyOn(incomeSourceTypeService, 'create').and.returnValue(of(null));
      spyOn(router, 'navigateByUrl');

      tester.detectChanges();

      expect(tester.componentInstance.incomeTypeForm.value).toEqual({ type: '' });
      expect(tester.type).toHaveValue('');
      tester.type.fillWith('CAF');
      tester.save.click();

      expect(incomeSourceTypeService.create).toHaveBeenCalledWith({ type: 'CAF' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    });

    it('should display an error message if no type', () => {
      const incomeSourceTypeService = TestBed.inject(IncomeSourceTypeService);
      const router: Router = TestBed.inject(Router);

      spyOn(incomeSourceTypeService, 'create').and.returnValue(of(null));
      spyOn(router, 'navigateByUrl');

      tester.detectChanges();

      expect(tester.testElement).not.toContainText('Le type est obligatoire');
      tester.save.click();

      expect(tester.testElement).toContainText('Le type est obligatoire');

      expect(incomeSourceTypeService.create).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});

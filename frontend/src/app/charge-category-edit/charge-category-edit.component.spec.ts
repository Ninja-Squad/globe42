import { TestBed } from '@angular/core/testing';

import { ChargeCategoryEditComponent } from './charge-category-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeCategoryService } from '../charge-category.service';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentTester } from 'ngx-speculoos';

class ChargeCategoryEditComponentTester extends ComponentTester<ChargeCategoryEditComponent> {
  constructor() {
    super(ChargeCategoryEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get name() {
    return this.input('#name');
  }

  get save() {
    return this.button('#save');
  }
}

describe('ChargeCategoryEditComponent', () => {
  @NgModule({
    imports: [
      CommonModule,
      HttpClientTestingModule,
      ReactiveFormsModule,
      RouterTestingModule,
      ValdemortModule
    ],
    declarations: [ChargeCategoryEditComponent, ValidationDefaultsComponent, PageTitleDirective]
  })
  class TestModule {}

  let tester: ChargeCategoryEditComponentTester;

  describe('in edit mode', () => {
    const chargeCategory: ChargeCategoryModel = { id: 42, name: 'rental' };
    const activatedRoute = {
      snapshot: { data: { chargeCategory } }
    };
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      router = TestBed.inject(Router);
      spyOn(router, 'navigateByUrl');

      tester = new ChargeCategoryEditComponentTester();
    });

    it('should have a title', () => {
      tester.detectChanges();

      expect(tester.title).toContainText('Modification de la dépense rental');
    });

    it('should edit and update an existing charge category', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'update').and.returnValue(of(null));
      tester.detectChanges();

      expect(tester.componentInstance.chargeCategoryForm.value).toEqual({ name: 'rental' });

      expect(tester.name).toHaveValue('rental');

      tester.name.fillWith('Charges locatives');
      tester.save.click();

      expect(chargeCategoryService.update).toHaveBeenCalledWith(42, { name: 'Charges locatives' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/charge-categories');
    });
  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

      router = TestBed.inject(Router);
      spyOn(router, 'navigateByUrl');
      tester = new ChargeCategoryEditComponentTester();
    });

    it('should have a title', () => {
      tester.detectChanges();

      expect(tester.title).toContainText('Nouvelle dépense');
    });

    it('should create and save a new charge category', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'create').and.returnValue(of(null));

      tester.detectChanges();

      expect(tester.componentInstance.chargeCategoryForm.value).toEqual({ name: '' });

      expect(tester.name).toHaveValue('');
      tester.name.fillWith('Charges locatives');
      tester.save.click();

      expect(chargeCategoryService.create).toHaveBeenCalledWith({ name: 'Charges locatives' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/charge-categories');
    });

    it('should display an error message if no name', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'create').and.returnValue(of(null));

      tester.detectChanges();

      expect(tester.testElement).not.toContainText('Le nom est obligatoire');

      tester.save.click();

      expect(tester.testElement).toContainText('Le nom est obligatoire');

      expect(chargeCategoryService.create).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});

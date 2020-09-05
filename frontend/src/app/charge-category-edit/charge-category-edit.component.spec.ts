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
    });

    it('should have a title', () => {
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
        'Modification de la dépense rental'
      );
    });

    it('should edit and update an existing charge category', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'update').and.returnValue(of(null));
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.chargeCategoryForm.value).toEqual({ name: 'rental' });

      const nativeElement = fixture.nativeElement;
      const type = nativeElement.querySelector('#name');
      expect(type.value).toBe('rental');

      type.value = 'Charges locatives';
      type.dispatchEvent(new Event('input'));

      nativeElement.querySelector('#save').click();

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
    });

    it('should have a title', () => {
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvelle dépense');
    });

    it('should create and save a new charge category', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'create').and.returnValue(of(null));
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);

      fixture.detectChanges();

      expect(fixture.componentInstance.chargeCategoryForm.value).toEqual({ name: '' });
      const nativeElement = fixture.nativeElement;

      const type = nativeElement.querySelector('#name');
      expect(type.value).toBe('');
      type.value = 'Charges locatives';

      type.dispatchEvent(new Event('input'));
      nativeElement.querySelector('#save').click();

      expect(chargeCategoryService.create).toHaveBeenCalledWith({ name: 'Charges locatives' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/charge-categories');
    });

    it('should display an error message if no name', () => {
      const chargeCategoryService = TestBed.inject(ChargeCategoryService);
      spyOn(chargeCategoryService, 'create').and.returnValue(of(null));
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);

      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).not.toContain('Le nom est obligatoire');

      const saveButton: HTMLButtonElement = element.querySelector('#save');
      saveButton.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('Le nom est obligatoire');

      expect(chargeCategoryService.create).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});

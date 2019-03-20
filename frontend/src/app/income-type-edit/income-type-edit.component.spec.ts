import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeTypeEditComponent } from './income-type-edit.component';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';

describe('IncomeTypeEditComponent', () => {

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, ValdemortModule],
    declarations: [IncomeTypeEditComponent, ValidationDefaultsComponent, PageTitleDirective]
  })
  class TestModule {}

  describe('in edit mode', () => {
    const incomeType: IncomeSourceTypeModel = { id: 42, type: 'CAF' };
    const activatedRoute = {
      snapshot: { data: { incomeType } }
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute }
        ]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    }));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de l\'organisme payeur CAF');
    });

    it('should edit and update an existing income type', () => {
      const incomeSourceTypeService: IncomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      spyOn(incomeSourceTypeService, 'update').and.returnValue(of(undefined));
      const router: Router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');

      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.incomeTypeForm.value).toEqual({ type: 'CAF' });

      const element: HTMLElement = fixture.nativeElement;
      const type: HTMLInputElement = element.querySelector('#type');
      expect(type.value).toBe('CAF');

      type.value = 'Caisse Allocations Familiales';
      type.dispatchEvent(new Event('input'));

      const saveButton: HTMLButtonElement = element.querySelector('#save');
      saveButton.click();

      expect(incomeSourceTypeService.update).toHaveBeenCalledWith(42, { type: 'Caisse Allocations Familiales' });

      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    });

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    }));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvel organisme payeur');
    });

    it('should create and save a new income type', () => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      const router: Router = TestBed.get(Router);

      spyOn(incomeSourceTypeService, 'create').and.returnValue(of(null));
      spyOn(router, 'navigateByUrl');

      const fixture = TestBed.createComponent(IncomeTypeEditComponent);

      fixture.detectChanges();

      expect(fixture.componentInstance.incomeTypeForm.value).toEqual({ type: '' });
      const element: HTMLElement = fixture.nativeElement;

      const type: HTMLInputElement = element.querySelector('#type');
      expect(type.value).toBe('');
      type.value = 'CAF';
      type.dispatchEvent(new Event('input'));

      const saveButton: HTMLButtonElement = element.querySelector('#save');
      saveButton.click();

      expect(incomeSourceTypeService.create).toHaveBeenCalledWith({ type: 'CAF' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    });

    it('should display an error message if no type', () => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      const router: Router = TestBed.get(Router);

      spyOn(incomeSourceTypeService, 'create').and.returnValue(of(null));
      spyOn(router, 'navigateByUrl');

      const fixture = TestBed.createComponent(IncomeTypeEditComponent);

      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.textContent).not.toContain('Le type est obligatoire');

      const saveButton: HTMLButtonElement = element.querySelector('#save');
      saveButton.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('Le type est obligatoire');

      expect(incomeSourceTypeService.create).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});

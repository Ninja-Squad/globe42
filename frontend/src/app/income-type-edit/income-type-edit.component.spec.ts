import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeTypeEditComponent } from './income-type-edit.component';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('IncomeTypeEditComponent', () => {

  const fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

  @NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule],
    declarations: [IncomeTypeEditComponent],
    providers: [{ provide: Router, useValue: fakeRouter }]
  })
  class TestModule {}


  describe('in edit mode', () => {
    const incomeType: IncomeSourceTypeModel = { id: 42, type: 'CAF' };
    const activatedRoute = {
      snapshot: { data: { incomeType } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de l\'organisme payeur CAF');
    });

    it('should edit and update an existing income type', async(() => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      spyOn(incomeSourceTypeService, 'update').and.returnValue(of(incomeType));
      const router = TestBed.get(Router);
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.incomeType).toEqual({ type: 'CAF' });

        const nativeElement = fixture.nativeElement;
        const type = nativeElement.querySelector('#type');
        expect(type.value).toBe('CAF');

        type.value = 'Caisse Allocations Familiales';
        type.dispatchEvent(new Event('input'));
        nativeElement.querySelector('#save').click();

        expect(incomeSourceTypeService.update).toHaveBeenCalledWith(42, { type: 'Caisse Allocations Familiales' });

        expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
      });
    }));

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: {} }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvel organisme payeur');
    });

    it('should create and save a new income type', fakeAsync(() => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      spyOn(incomeSourceTypeService, 'create').and.returnValue(of(null));
      const router = TestBed.get(Router);
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);

      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.incomeType).toEqual({ type: '' });
      const nativeElement = fixture.nativeElement;

      const type = nativeElement.querySelector('#type');
      expect(type.value).toBe('');
      type.value = 'CAF';

      type.dispatchEvent(new Event('input'));
      nativeElement.querySelector('#save').click();

      expect(incomeSourceTypeService.create).toHaveBeenCalledWith({ type: 'CAF' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    }));
  });
});

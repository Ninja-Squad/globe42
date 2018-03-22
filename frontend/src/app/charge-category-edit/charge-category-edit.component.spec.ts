import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChargeCategoryEditComponent } from './charge-category-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeCategoryService } from '../charge-category.service';
import { ErrorService } from '../error.service';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { of } from 'rxjs/observable/of';

describe('ChargeCategoryEditComponent', () => {
  const fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

  @NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule],
    declarations: [ChargeCategoryEditComponent],
    providers: [
      { provide: Router, useValue: fakeRouter },
      ChargeCategoryService,
      ErrorService
    ]
  })
  class TestModule {}


  describe('in edit mode', () => {
    const chargeCategory: ChargeCategoryModel = { id: 42, name: 'rental' };
    const activatedRoute = {
      snapshot: { data: { chargeCategory } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification de la dépense rental');
    });

    it('should edit and update an existing charge category', async(() => {
      const chargeCategoryService = TestBed.get(ChargeCategoryService);
      spyOn(chargeCategoryService, 'update').and.returnValue(of(chargeCategory));
      const router = TestBed.get(Router);
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.chargeCategory).toEqual({name: 'rental'});

        const nativeElement = fixture.nativeElement;
        const type = nativeElement.querySelector('#name');
        expect(type.value).toBe('rental');

        type.value = 'Charges locatives';
        type.dispatchEvent(new Event('input'));

        nativeElement.querySelector('#save').click();

        expect(chargeCategoryService.update).toHaveBeenCalledWith(42, { name: 'Charges locatives' });
        expect(router.navigateByUrl).toHaveBeenCalledWith('/charge-categories');
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
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouvelle dépense');
    });

    it('should create and save a new charge category', fakeAsync(() => {
      const chargeCategoryService = TestBed.get(ChargeCategoryService);
      spyOn(chargeCategoryService, 'create').and.returnValue(of(null));
      const router = TestBed.get(Router);
      const fixture = TestBed.createComponent(ChargeCategoryEditComponent);

      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.chargeCategory).toEqual({ name: '' });
      const nativeElement = fixture.nativeElement;

      const type = nativeElement.querySelector('#name');
      expect(type.value).toBe('');
      type.value = 'Charges locatives';

      type.dispatchEvent(new Event('input'));
      nativeElement.querySelector('#save').click();

      expect(chargeCategoryService.create).toHaveBeenCalledWith({ name: 'Charges locatives' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/charge-categories');
    }));
  });
});

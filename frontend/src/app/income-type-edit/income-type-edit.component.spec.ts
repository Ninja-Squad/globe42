import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeTypeEditComponent } from './income-type-edit.component';
import { AppModule } from '../app.module';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';

describe('IncomeTypeEditComponent', () => {

  describe('in edit mode', () => {
    const incomeType: IncomeSourceTypeModel = { id: 42, type: 'CAF' };
    const activatedRoute = {
      snapshot: { data: { incomeType } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Modification du type de revenu CAF');
    });

    it('should edit and update an existing income type', async(() => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      spyOn(incomeSourceTypeService, 'update').and.returnValue(Observable.of(incomeType));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.incomeType).toEqual({ type: 'CAF' })

        const nativeElement = fixture.nativeElement;
        const type = nativeElement.querySelector('#type');
        expect(type.value).toBe('CAF');

        type.value = 'Caisse Allocations Familiales';
        type.dispatchEvent(new Event('input'));
        nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
        fixture.detectChanges();

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
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Nouveau type de revenu');
    });

    it('should create and save a new income type', fakeAsync(() => {
      const incomeSourceTypeService = TestBed.get(IncomeSourceTypeService);
      spyOn(incomeSourceTypeService, 'create').and.returnValue(Observable.of(null));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);

      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.incomeType).toEqual({ type: '' });
      const nativeElement = fixture.nativeElement;

      const type = nativeElement.querySelector('#type');
      expect(type.value).toBe('');
      type.value = 'CAF';

      type.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      tick();

      expect(incomeSourceTypeService.create).toHaveBeenCalledWith({ type: 'CAF' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    }));
  });
});

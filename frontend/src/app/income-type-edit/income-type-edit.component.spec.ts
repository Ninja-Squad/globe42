import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IncomeTypeEditComponent } from './income-type-edit.component';
import { AppModule } from '../app.module';
import { IncomeService } from '../income.service';
import { IncomeSourceTypeModel } from '../models/income.model';

describe('IncomeTypeEditComponent', () => {

  describe('in edit mode', () => {
    const incomeType: IncomeSourceTypeModel = { id: 42, type: 'CAF' };
    const activatedRoute = {
      snapshot: { data: { incomeType } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should edit and update an existing income type', async(() => {
      const incomeService = TestBed.get(IncomeService);
      spyOn(incomeService, 'updateType').and.returnValue(Observable.of(incomeType));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {

        const nativeElement = fixture.nativeElement;
        const type = nativeElement.querySelector('#type');
        expect(type.value).toBe(incomeType.type);

        type.value = 'Caisse Allocations Familiales';
        type.dispatchEvent(new Event('input'));
        nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
        fixture.detectChanges();

        expect(incomeService.updateType).toHaveBeenCalled();

        const typeUpdated = incomeService.updateType.calls.argsFor(0)[0];
        expect(typeUpdated.id).toBe(42);
        expect(typeUpdated.type).toBe('Caisse Allocations Familiales');

        expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
      });
    }));

  });

  describe('in create mode', () => {
    const activatedRoute = {
      snapshot: { data: { incomeType: null } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should create and save a new income type', fakeAsync(() => {
      const incomeService = TestBed.get(IncomeService);
      spyOn(incomeService, 'createType').and.returnValue(Observable.of(null));
      const router = TestBed.get(Router);
      spyOn(router, 'navigateByUrl');
      const fixture = TestBed.createComponent(IncomeTypeEditComponent);

      fixture.detectChanges();
      tick();

      const nativeElement = fixture.nativeElement;

      const type = nativeElement.querySelector('#type');
      expect(type.value).toBe('');
      type.value = 'CAF';

      type.dispatchEvent(new Event('input'));
      nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      tick();

      expect(incomeService.createType).toHaveBeenCalled();

      const typeUpdated = incomeService.createType.calls.argsFor(0)[0] as IncomeSourceTypeModel;

      expect(typeUpdated.id).toBeUndefined();
      expect(typeUpdated.type).toBe('CAF');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/income-types');
    }));
  });
});

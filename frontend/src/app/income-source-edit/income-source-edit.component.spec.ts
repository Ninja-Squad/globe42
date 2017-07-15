import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSourceEditComponent } from './income-source-edit.component';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeService } from '../income.service';
import { Observable } from 'rxjs/Observable';
import { IncomeSourceModel } from '../models/income.model';

describe('IncomeSourceEditComponent', () => {

  const incomeSourceTypes = [
    { id: 1, type: 'B' },
    { id: 2, type: 'A' }
  ];

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { incomeSourceTypes } }
    };

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should expose sorted income source types', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSourceTypes.map(t => t.type)).toEqual(['A', 'B']);
    });

    it('should expose a default income source', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSource).toEqual({ name: '', typeId: null, maxMonthlyAmount: null });
    });

    it('should display the income source in a form, and have the save button disabled', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        expect(name.value).toBe('');

        const type: HTMLSelectElement = nativeElement.querySelector('#type');
        expect(type.selectedIndex).toBe(-1);
        expect(type.options.length).toBe(incomeSourceTypes.length + 1);

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        expect(maxMonthlyAmount.value).toBe('');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(true);
      });
    });

    it('should save the income source and navigate to the list', () => {
      const incomeService = TestBed.get(IncomeService);
      const router = TestBed.get(Router);

      spyOn(incomeService, 'createSource').and.returnValue(Observable.of({
        id: 42
      }));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        name.value = 'foo';
        name.dispatchEvent(new Event('input'));

        const type: HTMLSelectElement = nativeElement.querySelector('#type');
        type.selectedIndex = 1;
        type.dispatchEvent(new Event('change'));

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        maxMonthlyAmount.value = '123';
        maxMonthlyAmount.dispatchEvent(new Event('input'));

        const save = nativeElement.querySelector('#save');
        fixture.detectChanges();

        expect(save.disabled).toBe(false);

        save.click();

        expect(incomeService.createSource).toHaveBeenCalledWith({ name: 'foo', typeId: 2, maxMonthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/income-sources']);
      });
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

    beforeEach(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    }));

    it('should expose the edited income source info', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSource).toEqual({ name: 'foo', typeId: 2, maxMonthlyAmount: 123 });
    });

    it('should display the income source in a form, and have the save button enabled', () => {
      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const name = nativeElement.querySelector('#name');
        expect(name.value).toBe('foo');

        const type: HTMLSelectElement = nativeElement.querySelector('#type');
        expect(type.selectedIndex).toBe(1);

        const maxMonthlyAmount = nativeElement.querySelector('#maxMonthlyAmount');
        expect(maxMonthlyAmount.value).toBe('123');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(false);
      });
    });

    it('should save the income source and navigate to the income sources page', () => {
      const incomeService = TestBed.get(IncomeService);
      const router = TestBed.get(Router);

      spyOn(incomeService, 'updateSource').and.returnValue(Observable.of(null));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(IncomeSourceEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        const save = nativeElement.querySelector('#save');
        save.click();

        expect(incomeService.updateSource).toHaveBeenCalledWith(42, { name: 'foo', typeId: 2, maxMonthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/income-sources']);
      });
    });
  });
});

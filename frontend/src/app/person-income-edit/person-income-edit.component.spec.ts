import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonIncomeEditComponent } from './person-income-edit.component';
import { AppModule } from "app/app.module";
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeService } from '../income.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('PersonIncomeEditComponent', () => {
  const incomeSources = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A' }
  ];

  const person = {id: 42, firstName: 'Jean-Baptiste', lastName: 'Nizet', 'nickName': 'JB'}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { person, incomeSources } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Créer un nouveau revenu pour Jean-Baptiste Nizet (JB)');
    });

    it('should expose sorted income sources', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.incomeSources.map(t => t.name)).toEqual(['A', 'B']);
    });

    it('should expose a default income', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.income).toEqual({ source: null, monthlyAmount: null });
    });

    it('should display the income in a form, and have the save button disabled', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const source: HTMLSelectElement = nativeElement.querySelector('#source');
        expect(source.selectedIndex).toBe(-1);
        expect(source.options.length).toBe(incomeSources.length + 1);


        const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
        expect(monthlyAmount.value).toBe('');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(true);
      });
    });

    it('should save the income and navigate to the income list', () => {
      const incomeService = TestBed.get(IncomeService);
      const router = TestBed.get(Router);

      spyOn(incomeService, 'create').and.returnValue(Observable.of({
        id: 42
      }));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const source: HTMLSelectElement = nativeElement.querySelector('#source');
        source.selectedIndex = 1;
        source.dispatchEvent(new Event('change'));

        const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
        monthlyAmount.value = '123';
        monthlyAmount.dispatchEvent(new Event('input'));

        const save = nativeElement.querySelector('#save');
        fixture.detectChanges();

        expect(save.disabled).toBe(false);

        save.click();

        expect(incomeService.create).toHaveBeenCalledWith(42, { sourceId: 2, monthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'incomes']);
      });
    });
  });
});

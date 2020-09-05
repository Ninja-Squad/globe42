import { TestBed } from '@angular/core/testing';

import { PersonIncomeEditComponent } from './person-income-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FullnamePipe } from '../fullname.pipe';
import { of } from 'rxjs';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeService } from '../income.service';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { IncomeModel } from '../models/income.model';

describe('PersonIncomeEditComponent', () => {
  const incomeSources = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A', maxMonthlyAmount: 100 }
  ] as Array<IncomeSourceModel>;

  const person = { id: 42, firstName: 'Jean-Baptiste', lastName: 'Nizet', nickName: 'JB' };

  @NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterTestingModule,
      ValdemortModule
    ],
    declarations: [
      PersonIncomeEditComponent,
      FullnamePipe,
      ValidationDefaultsComponent,
      PageTitleDirective
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { person, incomeSources } }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    });

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
        'Créer un nouveau revenu pour Jean-Baptiste Nizet (JB)'
      );
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
      expect(component.incomeForm.value).toEqual({ source: null, monthlyAmount: null });
    });

    it('should display the income in a form, and validate the form', () => {
      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const incomeSource: HTMLSelectElement = element.querySelector('#source');
      expect(incomeSource.selectedIndex).toBe(0);
      expect(incomeSource.options.length).toBe(incomeSources.length + 1);

      const monthlyAmount: HTMLInputElement = element.querySelector('#monthlyAmount');
      expect(monthlyAmount.value).toBe('');

      expect(element.textContent).not.toContain('La nature de la prestation est obligatoire');
      expect(element.textContent).not.toContain('Le montant mensuel est obligatoire');

      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('La nature de la prestation est obligatoire');
      expect(element.textContent).toContain('Le montant mensuel est obligatoire');

      monthlyAmount.value = '0';
      monthlyAmount.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(element.textContent).toContain('La nature de la prestation est obligatoire');
      expect(element.textContent).toContain('Le montant mensuel doit être positif');

      incomeSource.selectedIndex = 1;
      incomeSource.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      monthlyAmount.value = '101';
      monthlyAmount.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(element.textContent).not.toContain('La nature de la prestation est obligatoire');
      expect(element.textContent).toContain(
        'Le montant mensuel ne peut pas dépasser la valeur maximale pour cette nature de prestation\u00a0: 100,00\u00a0€'
      );

      incomeSource.selectedIndex = 0;
      incomeSource.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(element.textContent).not.toContain(
        'Le montant mensuel ne peut pas dépasser la valeur maximale'
      );
    });

    it('should save the income and navigate to the resource list', () => {
      const incomeService = TestBed.inject(IncomeService);
      const router = TestBed.inject(Router);

      spyOn(incomeService, 'create').and.returnValue(
        of({
          id: 42
        } as IncomeModel)
      );
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(PersonIncomeEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;

      const incomeSource: HTMLSelectElement = nativeElement.querySelector('#source');
      incomeSource.selectedIndex = 1;
      incomeSource.dispatchEvent(new Event('change'));

      const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
      monthlyAmount.value = '12';
      monthlyAmount.dispatchEvent(new Event('input'));

      const save = nativeElement.querySelector('#save');
      fixture.detectChanges();

      expect(save.disabled).toBe(false);

      save.click();

      expect(incomeService.create).toHaveBeenCalledWith(42, { sourceId: 2, monthlyAmount: 12 });

      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'resources']);
    });
  });
});

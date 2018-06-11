import { async, TestBed } from '@angular/core/testing';

import { PersonChargeEditComponent } from './person-charge-edit.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FullnamePipe } from '../fullname.pipe';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ChargeService } from '../charge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ChargeTypeModel } from '../models/charge-type.model';
import { ValidationErrorDirective, ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

describe('PersonChargeEditComponent', () => {
  const chargeTypes = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A', maxMonthlyAmount: 100 }
  ] as Array<ChargeTypeModel>;

  const person = {id: 42, firstName: 'Jean-Baptiste', lastName: 'Nizet', 'nickName': 'JB'};

  @NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule],
    declarations: [PersonChargeEditComponent, FullnamePipe, ValidationErrorsComponent, ValidationErrorDirective],
    providers: [
      { provide: LOCALE_ID, useValue: 'fr-FR' }
    ]
  })
  class TestModule {}

  describe('in creation mode', () => {
    const activatedRoute = {
      snapshot: { data: { person, chargeTypes } }
    };

    beforeEach(async(() => TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })));

    it('should have a title', () => {
      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Créer une nouvelle charge pour Jean-Baptiste Nizet (JB)');
    });

    it('should expose sorted charge types', () => {
      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.chargeTypes.map(t => t.name)).toEqual(['A', 'B']);
    });

    it('should expose a default charge', () => {
      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.chargeForm.value).toEqual({ type: null, monthlyAmount: null });
    });

    it('should display the charge in a form, and validate the form', () => {
      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;

      const chargeType: HTMLSelectElement = element.querySelector('#type');
      expect(chargeType.selectedIndex).toBeLessThan(1); // 0 on Safari, -1 on good browsers
      expect(chargeType.options.length).toBe(chargeTypes.length + 1);

      const monthlyAmount: HTMLInputElement = element.querySelector('#monthlyAmount');
      expect(monthlyAmount.value).toBe('');

      const save: HTMLButtonElement = element.querySelector('#save');
      save.click();
      fixture.detectChanges();

      expect(element.textContent).toContain('La nature de la charge est obligatoire');
      expect(element.textContent).toContain('Le montant mensuel est obligatoire');

      monthlyAmount.value = '0';
      monthlyAmount.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(element.textContent).toContain('La nature de la charge est obligatoire');
      expect(element.textContent).toContain('Le montant mensuel doit être positif');

      chargeType.selectedIndex = 1;
      chargeType.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      monthlyAmount.value = '101';
      monthlyAmount.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(element.textContent).not.toContain('La nature de la charge est obligatoire');
      expect(element.textContent).toContain(
        'Le montant mensuel ne peut pas dépasser la valeur maximale pour ce type de charge\u00a0: 100,00\u00a0€');

      chargeType.selectedIndex = 0;
      chargeType.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(element.textContent).not.toContain('Le montant mensuel ne peut pas dépasser la valeur maximale');
    });

    it('should save the charge and navigate to the resource list', () => {
      const incomeService = TestBed.get(ChargeService);
      const router = TestBed.get(Router);

      spyOn(incomeService, 'create').and.returnValue(of({
        id: 42
      }));
      spyOn(router, 'navigate');

      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;

      const type: HTMLSelectElement = nativeElement.querySelector('#type');
      type.selectedIndex = 1;
      type.dispatchEvent(new Event('change'));

      const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
      monthlyAmount.value = '12';
      monthlyAmount.dispatchEvent(new Event('input'));

      const save = nativeElement.querySelector('#save');
      fixture.detectChanges();

      expect(save.disabled).toBe(false);

      save.click();

      expect(incomeService.create).toHaveBeenCalledWith(42, { typeId: 2, monthlyAmount: 12 });

      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'resources']);
    });
  });
});

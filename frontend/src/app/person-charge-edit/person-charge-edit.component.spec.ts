import { async, TestBed } from '@angular/core/testing';

import { PersonChargeEditComponent } from './person-charge-edit.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FullnamePipe } from '../fullname.pipe';
import { NgModule } from '@angular/core';
import { ChargeService } from '../charge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PersonChargeEditComponent', () => {
  const chargeTypes = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A' }
  ];

  const person = {id: 42, firstName: 'Jean-Baptiste', lastName: 'Nizet', 'nickName': 'JB'};

  @NgModule({
    imports: [CommonModule, HttpClientModule, FormsModule, RouterTestingModule],
    declarations: [PersonChargeEditComponent, FullnamePipe]
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
      expect(component.charge).toEqual({ type: null, monthlyAmount: null });
    });

    it('should display the charge in a form, and have the save button disabled', () => {
      const fixture = TestBed.createComponent(PersonChargeEditComponent);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const source: HTMLSelectElement = nativeElement.querySelector('#type');
        expect(source.selectedIndex).toBe(-1);
        expect(source.options.length).toBe(chargeTypes.length + 1);


        const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
        expect(monthlyAmount.value).toBe('');

        const save = nativeElement.querySelector('#save');
        expect(save.disabled).toBe(true);
      });
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

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;

        const type: HTMLSelectElement = nativeElement.querySelector('#type');
        type.selectedIndex = 1;
        type.dispatchEvent(new Event('change'));

        const monthlyAmount = nativeElement.querySelector('#monthlyAmount');
        monthlyAmount.value = '123';
        monthlyAmount.dispatchEvent(new Event('input'));

        const save = nativeElement.querySelector('#save');
        fixture.detectChanges();

        expect(save.disabled).toBe(false);

        save.click();

        expect(incomeService.create).toHaveBeenCalledWith(42, { typeId: 2, monthlyAmount: 123 });

        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'resources']);
      });
    });
  });
});

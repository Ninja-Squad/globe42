import { TestBed } from '@angular/core/testing';

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
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { ChargeModel } from '../models/charge.model';
import { ComponentTester } from 'ngx-speculoos';
import { PersonModel } from '../models/person.model';

class PersonChargeEditComponentTester extends ComponentTester<PersonChargeEditComponent> {
  constructor() {
    super(PersonChargeEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get chargeType() {
    return this.select('#type');
  }

  get monthlyAmount() {
    return this.input('#monthlyAmount');
  }

  get save() {
    return this.button('#save');
  }
}

describe('PersonChargeEditComponent', () => {
  let chargeTypes: Array<ChargeTypeModel>;
  let person: PersonModel;
  let tester: PersonChargeEditComponentTester;

  @NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      RouterTestingModule,
      ValdemortModule
    ],
    declarations: [
      PersonChargeEditComponent,
      FullnamePipe,
      ValidationDefaultsComponent,
      PageTitleDirective
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
  })
  class TestModule {}

  beforeEach(() => {
    chargeTypes = [
      { id: 1, name: 'B' },
      { id: 2, name: 'A', maxMonthlyAmount: 100 }
    ] as Array<ChargeTypeModel>;
    person = {
      id: 42,
      firstName: 'Jean-Baptiste',
      lastName: 'Nizet',
      nickName: 'JB'
    } as PersonModel;
  });

  describe('in creation mode', () => {
    beforeEach(() => {
      const activatedRoute = {
        snapshot: { data: { person, chargeTypes } }
      };

      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
      });

      TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
      tester = new PersonChargeEditComponentTester();
    });

    it('should have a title', () => {
      tester.detectChanges();

      expect(tester.title).toContainText('Créer une nouvelle charge pour Jean-Baptiste Nizet (JB)');
    });

    it('should expose sorted charge types', () => {
      tester.detectChanges();

      expect(tester.componentInstance.chargeTypes.map(t => t.name)).toEqual(['A', 'B']);
    });

    it('should expose a default charge', () => {
      tester.detectChanges();

      expect(tester.componentInstance.chargeForm.value).toEqual({
        type: null,
        monthlyAmount: null
      });
    });

    it('should display the charge in a form, and validate the form', () => {
      tester.detectChanges();

      expect(tester.chargeType.selectedIndex).toBeLessThan(1); // 0 on Safari, -1 on good browsers
      expect(tester.chargeType.optionLabels.length).toBe(chargeTypes.length + 1);

      expect(tester.monthlyAmount).toHaveValue('');

      tester.save.click();

      expect(tester.testElement).toContainText('La nature de la charge est obligatoire');
      expect(tester.testElement).toContainText('Le montant mensuel est obligatoire');

      tester.monthlyAmount.fillWith('0');

      expect(tester.testElement).toContainText('La nature de la charge est obligatoire');
      expect(tester.testElement).toContainText('Le montant mensuel doit être positif');

      tester.chargeType.selectIndex(1);
      tester.monthlyAmount.fillWith('101');

      expect(tester.testElement).not.toContainText('La nature de la charge est obligatoire');
      expect(tester.testElement).toContainText(
        'Le montant mensuel ne peut pas dépasser la valeur maximale pour ce type de charge\u00a0: 100,00\u00a0€'
      );

      tester.chargeType.selectIndex(0);

      expect(tester.testElement).not.toContainText(
        'Le montant mensuel ne peut pas dépasser la valeur maximale'
      );
    });

    it('should save the charge and navigate to the resource list', () => {
      const chargeService = TestBed.inject(ChargeService);
      const router = TestBed.inject(Router);

      spyOn(chargeService, 'create').and.returnValue(
        of({
          id: 42
        } as ChargeModel)
      );
      spyOn(router, 'navigate');

      tester.detectChanges();

      tester.chargeType.selectIndex(1);
      tester.monthlyAmount.fillWith('12');

      expect(tester.save.disabled).toBe(false);

      tester.save.click();

      expect(chargeService.create).toHaveBeenCalledWith(42, { typeId: 2, monthlyAmount: 12 });

      tester.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'resources']);
    });
  });
});

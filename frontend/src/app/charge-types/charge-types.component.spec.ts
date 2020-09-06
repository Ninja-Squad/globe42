import { TestBed } from '@angular/core/testing';

import { ChargeTypesComponent } from './charge-types.component';
import { ChargeTypeModel } from '../models/charge-type.model';
import { RouterTestingModule } from '@angular/router/testing';
import { LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class ChargeTypesComponentTester extends ComponentTester<ChargeTypesComponent> {
  constructor() {
    super(ChargeTypesComponent);
  }

  get chargeTypes() {
    return this.elements('.charge-type-item');
  }
}

describe('ChargeTypesComponent', () => {
  let tester: ChargeTypesComponentTester;

  beforeEach(() => {
    const chargeTypes: Array<ChargeTypeModel> = [
      {
        id: 12,
        name: 'Loyer',
        category: { id: 42, name: 'Charges locatives' },
        maxMonthlyAmount: 789.01
      },
      {
        id: 13,
        name: 'Nourriture',
        category: { id: 43, name: 'Vie quotidienne' },
        maxMonthlyAmount: null
      }
    ];

    const activatedRoute = {
      snapshot: { data: { chargeTypes } }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ChargeTypesComponent, PageTitleDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
      ]
    });

    tester = new ChargeTypesComponentTester();
    tester.detectChanges();
  });

  it('should list charge types', () => {
    expect(tester.chargeTypes.length).toBe(2);

    const chargeType1 = tester.chargeTypes[0];
    expect(chargeType1).toContainText('Charges locatives');
    expect(chargeType1).toContainText('Loyer');
    expect(chargeType1).toContainText('max. 789,01 € / mois');

    const chargeType2 = tester.chargeTypes[1];
    expect(chargeType2).not.toContainText('max.');
  });
});

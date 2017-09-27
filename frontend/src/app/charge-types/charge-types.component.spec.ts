import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeTypesComponent } from './charge-types.component';
import { ChargeTypeModel } from '../models/charge-type.model';
import { RouterTestingModule } from '@angular/router/testing';
import { LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('ChargeTypesComponent', () => {
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
    }];

  const activatedRoute = {
    snapshot: { data: { chargeTypes } }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [ChargeTypesComponent],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR'}
    ]
  })));

  it('should list charge types', () => {
    const fixture = TestBed.createComponent(ChargeTypesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const sources = nativeElement.querySelectorAll('div.charge-type-item');
    expect(sources.length).toBe(2);

    const source1 = sources[0];
    expect(source1.textContent).toContain('Charges locatives');
    expect(source1.textContent).toContain('Loyer');
    expect(source1.textContent).toContain('max. 789,01 € / mois');

    const source2 = sources[1];
    expect(source2.textContent).not.toContain('max.');
  });
});

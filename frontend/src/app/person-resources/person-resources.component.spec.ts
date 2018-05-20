import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonResourcesComponent } from './person-resources.component';
import { IncomeModel } from '../models/income.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import { IncomeService } from '../income.service';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { ChargeModel } from '../models/charge.model';
import { ChargeService } from '../charge.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { of, throwError } from 'rxjs';
import { PerUnitRevenueInformationModel } from '../models/per-unit-revenue-information.model';
import { PerUnitRevenueInformationService } from '../per-unit-revenue-information.service';
import { ComponentTester, fakeRoute, fakeSnapshot, TestButton } from 'ngx-fixture';

class PersonResourcesTester extends ComponentTester<PersonResourcesComponent> {
  constructor(fixture: ComponentFixture<PersonResourcesComponent>) {
    super(fixture);
  }

  incomeItems() {
    return this.elements('.income-item');
  }

  noIncome() {
    return this.element('#no-income');
  }

  totalIncome() {
    return this.element('#total-income');
  }

  deleteIncomeButtons() {
    return this.elements('.delete-income-button') as Array<TestButton>;
  }

  chargeItems() {
    return this.elements('.charge-item');
  }

  noCharge() {
    return this.element('#no-charge');
  }

  totalCharge() {
    return this.element('#total-charge');
  }

  deleteChargeButtons() {
    return this.elements('.delete-charge-button') as Array<TestButton> ;
  }

  total() {
    return this.element('#total');
  }

  unitItems() {
    return this.elements('.unit-item');
  }

  noPerUnitRevenue() {
    return this.element('#no-per-unit-revenue');
  }

  perUnitRevenue() {
    return this.element('#per-unit-revenue');
  }

  deletePerUnitRevenueInformationButton() {
    return this.button('#delete-per-unit-revenue-information-button');
  }
}

describe('PersonResourcesComponent', () => {
  const incomes = [
    {
      id: 12,
      source: { name: 'Allocations familiales'},
      monthlyAmount: 789.01
    },
    {
      id: 13,
      source: { name: 'Salaire'},
      monthlyAmount: 300
    }
  ] as Array<IncomeModel>;

  const charges = [
    {
      id: 14,
      type: { name: 'Loyer'},
      monthlyAmount: 400
    },
    {
      id: 15,
      type: { name: 'Electricité'},
      monthlyAmount: 50
    }
  ] as Array<ChargeModel>;

  const perUnitRevenueInformation: PerUnitRevenueInformationModel = {
    adultLikeCount: 4,
    childCount: 2,
    monoParental: true
  };

  const activatedRoute = fakeRoute({
    snapshot: fakeSnapshot({
      data: {
        incomes,
        charges,
        perUnitRevenueInformation
      }
    }),
    parent: fakeRoute({
      snapshot: fakeSnapshot({
        data: {
          person: {
            id: 42,
            nickName: 'JB'
          }
        }
      })
    })
  });

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule, GlobeNgbModule.forRoot()],
    declarations: [PersonResourcesComponent],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR' }
    ]
  })));

  it('should list incomes', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    expect(tester.incomeItems().length).toBe(2);
    const income1 = tester.incomeItems()[0];
    expect(income1.textContent).toContain('Allocations familiales');
    expect(income1.textContent).toContain('789,01 € / mois');

    expect(tester.noIncome()).toBeFalsy();
  });

  it('should display no income message and no total income when no income', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.componentInstance.incomes = [];
    tester.detectChanges();

    expect(tester.incomeItems().length).toBe(0);
    expect(tester.noIncome().textContent).toContain('Aucun revenu\u00A0!');
    expect(tester.totalIncome()).toBeNull();
  });

  it('should display total income', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    expect(tester.totalIncome().textContent).toContain('Total');
    expect(tester.totalIncome().textContent).toContain('1\u00A0089,01 € / mois');
  });

  it('should ask for confirmation before deletion of income', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const incomeService = TestBed.get(IncomeService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(incomeService, 'delete');

    tester.deleteIncomeButtons()[0].click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).not.toHaveBeenCalled();
  });

  it('should delete income once confirmed', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const incomeService = TestBed.get(IncomeService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(incomeService, 'delete').and.returnValue(of(null));

    const newIncomes = [
      {
        id: 3,
        source: { name: 'Salaire' },
        monthlyAmount: 500
      }
    ] as Array<IncomeModel>;
    spyOn(incomeService, 'list').and.returnValue(of(newIncomes));

    tester.deleteIncomeButtons()[0].click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).toHaveBeenCalledWith(42, 12);
    expect(tester.componentInstance.incomes).toEqual(newIncomes);
  });

  it('should list charges', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    expect(tester.chargeItems().length).toBe(2);

    const income1 = tester.chargeItems()[0];
    expect(income1.textContent).toContain('Loyer');
    expect(income1.textContent).toContain('400,00 € / mois');

    expect(tester.noCharge()).toBeFalsy();
  });

  it('should display no charge message and no total charge when no charge', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.componentInstance.charges = [];
    tester.detectChanges();

    expect(tester.chargeItems().length).toBe(0);
    expect(tester.noCharge().textContent).toContain('Aucune charge\u00A0!');
    expect(tester.totalCharge()).toBeNull();
  });

  it('should display total charge', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    expect(tester.totalCharge().textContent).toContain('Total');
    expect(tester.totalCharge().textContent).toContain('450,00 € / mois');
  });

  it('should ask for confirmation before deletion of charge', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const chargeService = TestBed.get(ChargeService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(chargeService, 'delete');

    tester.deleteChargeButtons()[0].click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(chargeService.delete).not.toHaveBeenCalled();
  });

  it('should delete charge once confirmed', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const chargeService = TestBed.get(ChargeService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(chargeService, 'delete').and.returnValue(of(null));

    const newCharges = [
      {
        id: 15,
        type: { name: 'Electricité' },
        monthlyAmount: 50
      }
    ] as Array<ChargeModel>;
    spyOn(chargeService, 'list').and.returnValue(of(newCharges));

    tester.deleteChargeButtons()[0].click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(chargeService.delete).toHaveBeenCalledWith(42, 14);
    expect(tester.componentInstance.charges).toEqual(newCharges);
  });

  it('should display the grand total', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    expect(tester.total().textContent).toContain('Reste à vivre');
    expect(tester.total().textContent).toContain('639,01 € / mois');

    tester.componentInstance.charges = [];
    tester.detectChanges();
    expect(tester.total().textContent).toContain('1\u00A0089,01 € / mois');

    tester.componentInstance.incomes = [];
    tester.componentInstance.charges = charges;
    tester.detectChanges();
    expect(tester.total().textContent).toContain('-450,00 € / mois');

    tester.componentInstance.charges = [];
    tester.detectChanges();
    expect(tester.total()).toBeNull();
  });

  it('should list units', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const unitItems = tester.unitItems();
    expect(unitItems.length).toBe(4);
    expect(unitItems[0].textContent).toContain('1 unité');
    expect(unitItems[1].textContent).toContain('1,5 unité(s)');
    expect(unitItems[2].textContent).toContain('0,6 unité(s)');
    expect(unitItems[3].textContent).toContain('0,2 unité');

    expect(tester.noPerUnitRevenue()).toBeFalsy();
    expect(tester.perUnitRevenue().textContent).toContain('330,00 € / mois');
  });

  it('should display no information message when no information', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.componentInstance.perUnitRevenueInformation = null;
    tester.detectChanges();

    expect(tester.unitItems().length).toBe(0);
    expect(tester.noPerUnitRevenue().textContent).toContain('Information non renseignée\u00A0!');
    expect(tester.perUnitRevenue()).toBeNull();
  });

  it('should ask for confirmation before deletion of info', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const infoService = TestBed.get(PerUnitRevenueInformationService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(infoService, 'delete');

    tester.deletePerUnitRevenueInformationButton().click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(infoService.delete).not.toHaveBeenCalled();
  });

  it('should delete info once confirmed', () => {
    const tester = new PersonResourcesTester(TestBed.createComponent(PersonResourcesComponent));
    tester.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const infoService = TestBed.get(PerUnitRevenueInformationService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(infoService, 'delete').and.returnValue(of(undefined));

    tester.deletePerUnitRevenueInformationButton().click();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(infoService.delete).toHaveBeenCalledWith(42);
    expect(tester.componentInstance.perUnitRevenueInformation).toBeNull();
  });
});


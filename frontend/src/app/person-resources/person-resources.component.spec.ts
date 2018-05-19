import { async, TestBed } from '@angular/core/testing';

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
import { fakeRoute, fakeSnapshot } from 'ngx-fixture';

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
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const incomeElements = nativeElement.querySelectorAll('div.income-item');
    expect(incomeElements.length).toBe(2);

    const income1 = incomeElements[0];
    expect(income1.textContent).toContain('Allocations familiales');
    expect(income1.textContent).toContain('789,01 € / mois');

    expect(nativeElement.querySelector('#no-income')).toBeFalsy();
  });

  it('should display no income message and no total income when no income', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.componentInstance.incomes = [];
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const incomeElements = nativeElement.querySelectorAll('div.income-item');
    expect(incomeElements.length).toBe(0);

    const noIncome = nativeElement.querySelector('#no-income');
    expect(noIncome.textContent).toContain('Aucun revenu\u00A0!');

    const totalIncome = nativeElement.querySelector('#total-income');
    expect(totalIncome).toBeNull();
  });

  it('should display total income', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const totalIncome = nativeElement.querySelector('#total-income');
    expect(totalIncome.textContent).toContain('Total');
    expect(totalIncome.textContent).toContain('1\u00A0089,01 € / mois');
  });

  it('should ask for confirmation before deletion of income', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const incomeService = TestBed.get(IncomeService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(incomeService, 'delete');

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-income-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).not.toHaveBeenCalled();
  });

  it('should delete income once confirmed', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

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

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-income-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).toHaveBeenCalledWith(42, 12);
    expect(fixture.componentInstance.incomes).toEqual(newIncomes);
  });

  it('should list charges', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const chargeElements = nativeElement.querySelectorAll('div.charge-item');
    expect(chargeElements.length).toBe(2);

    const income1 = chargeElements[0];
    expect(income1.textContent).toContain('Loyer');
    expect(income1.textContent).toContain('400,00 € / mois');

    expect(nativeElement.querySelector('#no-charge')).toBeFalsy();
  });

  it('should display no charge message and no total charge when no charge', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.componentInstance.charges = [];
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const chargeElements = nativeElement.querySelectorAll('div.charge-item');
    expect(chargeElements.length).toBe(0);

    const noIncome = nativeElement.querySelector('#no-charge');
    expect(noIncome.textContent).toContain('Aucune charge\u00A0!');

    const totalIncome = nativeElement.querySelector('#total-charge');
    expect(totalIncome).toBeNull();
  });

  it('should display total charge', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const totalCharge = nativeElement.querySelector('#total-charge');
    expect(totalCharge.textContent).toContain('Total');
    expect(totalCharge.textContent).toContain('450,00 € / mois');
  });

  it('should ask for confirmation before deletion of charge', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const chargeService = TestBed.get(ChargeService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(chargeService, 'delete');

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-charge-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(chargeService.delete).not.toHaveBeenCalled();
  });

  it('should delete charge once confirmed', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

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

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-charge-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(chargeService.delete).toHaveBeenCalledWith(42, 14);
    expect(fixture.componentInstance.charges).toEqual(newCharges);
  });

  it('should display the grand total', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    let totalIncome = nativeElement.querySelector('#total');
    expect(totalIncome.textContent).toContain('Reste à vivre');
    expect(totalIncome.textContent).toContain('639,01 € / mois');

    fixture.componentInstance.charges = [];
    fixture.detectChanges();
    expect(totalIncome.textContent).toContain('1\u00A0089,01 € / mois');

    fixture.componentInstance.incomes = [];
    fixture.componentInstance.charges = charges;
    fixture.detectChanges();
    expect(totalIncome.textContent).toContain('-450,00 € / mois');

    fixture.componentInstance.charges = [];
    fixture.detectChanges();
    totalIncome = nativeElement.querySelector('#total');
    expect(totalIncome).toBeNull();
  });

  it('should list units', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const unitElements = nativeElement.querySelectorAll('div.unit-item');
    expect(unitElements.length).toBe(4);
    expect(unitElements[0].textContent).toContain('1 unité');
    expect(unitElements[1].textContent).toContain('1,5 unité(s)');
    expect(unitElements[2].textContent).toContain('0,6 unité(s)');
    expect(unitElements[3].textContent).toContain('0,2 unité');

    expect(nativeElement.querySelector('#no-per-unit-revenue')).toBeFalsy();
    expect(nativeElement.querySelector('#per-unit-revenue').textContent).toContain('330,00 € / mois');
  });

  it('should display no information message when no information', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.componentInstance.perUnitRevenueInformation = null;
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const unitElements = nativeElement.querySelectorAll('div.unit-item');
    expect(unitElements.length).toBe(0);

    const noInfo = nativeElement.querySelector('#no-per-unit-revenue');
    expect(noInfo.textContent).toContain('Information non renseignée\u00A0!');

    const perUnitRevenue = nativeElement.querySelector('#per-unit-revenue');
    expect(perUnitRevenue).toBeNull();
  });

  it('should ask for confirmation before deletion of info', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const infoService = TestBed.get(PerUnitRevenueInformationService);
    spyOn(confirmService, 'confirm').and.returnValue(throwError(null));
    spyOn(infoService, 'delete');

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelector('#delete-per-unit-revenue-information-button');
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(infoService.delete).not.toHaveBeenCalled();
  });

  it('should delete info once confirmed', () => {
    const fixture = TestBed.createComponent(PersonResourcesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const infoService = TestBed.get(PerUnitRevenueInformationService);
    spyOn(confirmService, 'confirm').and.returnValue(of(null));
    spyOn(infoService, 'delete').and.returnValue(of(undefined));

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelector('#delete-per-unit-revenue-information-button');
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(infoService.delete).toHaveBeenCalledWith(42);
    expect(fixture.componentInstance.perUnitRevenueInformation).toBeNull();
  });
});

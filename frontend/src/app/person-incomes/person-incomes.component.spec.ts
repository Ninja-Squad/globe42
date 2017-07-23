import { async, TestBed } from '@angular/core/testing';

import { PersonIncomesComponent } from './person-incomes.component';
import { IncomeModel } from '../models/income.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import { Observable } from 'rxjs/Observable';
import { IncomeService } from '../income.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';

describe('PersonIncomesComponent', () => {
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

  const activatedRoute = {
    snapshot: { data: { incomes } },
    parent: {
      snapshot: {
        data: {
          person: {
            id: 42,
            nickName: 'JB'
          }
        }
      }
    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule, NgbModule.forRoot()],
    declarations: [PersonIncomesComponent],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: LOCALE_ID, useValue: 'fr-FR' },
      IncomeService,
      ConfirmService
    ]
  })));

  it('should list incomes', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const incomeElements = nativeElement.querySelectorAll('div.income-item');
    expect(incomeElements.length).toBe(2);

    const income1 = incomeElements[0];
    expect(income1.textContent).toContain('Allocations familiales');
    expect(income1.textContent).toContain('789,01 € / mois');

    expect(nativeElement.querySelector('#no-income')).toBeFalsy();
  });

  it('should display no income message and no total when no income', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
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
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const totalIncome = nativeElement.querySelector('#total-income');
    expect(totalIncome.textContent).toContain('Total');
    expect(totalIncome.textContent).toContain('1\u00A0089,01 € / mois');
  });

  it('should ask for confirmation before deletion', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const incomeService = TestBed.get(IncomeService);
    spyOn(confirmService, 'confirm').and.returnValue(Observable.throw(null));
    spyOn(incomeService, 'delete');

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).not.toHaveBeenCalled();
  });

  it('should delete once confirmed', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const confirmService = TestBed.get(ConfirmService);
    const incomeService = TestBed.get(IncomeService);
    spyOn(confirmService, 'confirm').and.returnValue(Observable.of(null));
    spyOn(incomeService, 'delete').and.returnValue(Observable.of(null));

    const newIncomes = [
      {
        id: 3,
        source: { name: 'Salaire' },
        monthlyAmount: 500
      }
    ] as Array<IncomeModel>;
    spyOn(incomeService, 'list').and.returnValue(Observable.of(newIncomes));

    const nativeElement = fixture.nativeElement;
    const deleteButton: HTMLButtonElement = nativeElement.querySelectorAll('.delete-button')[0];
    deleteButton.click();

    fixture.detectChanges();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(incomeService.delete).toHaveBeenCalledWith(42, 12);
    expect(fixture.componentInstance.incomes).toEqual(newIncomes);
  });
});

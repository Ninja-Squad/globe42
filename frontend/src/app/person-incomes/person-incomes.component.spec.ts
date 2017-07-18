import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonIncomesComponent } from './person-incomes.component';
import { IncomeModel } from '../models/income.model';
import { AppModule } from '../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '../confirm.service';
import { Observable } from 'rxjs/Observable';
import { IncomeService } from '../income.service';

describe('PersonIncomesComponent', () => {
  const incomes: Array<IncomeModel> = [
    {
      id: 12,
      source: { name: 'Allocations familiales'},
      monthlyAmount: 789.01
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
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should list incomes', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const incomes = nativeElement.querySelectorAll('div.income-item');
    expect(incomes.length).toBe(1);

    const income1 = incomes[0];
    expect(income1.textContent).toContain('Allocations familiales');
    expect(income1.textContent).toContain('789,01 € / mois');

    expect(nativeElement.querySelector('#no-income')).toBeFalsy();
  });

  it('should display no income message when no income', () => {
    const fixture = TestBed.createComponent(PersonIncomesComponent);
    fixture.componentInstance.incomes = [];
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const incomes = nativeElement.querySelectorAll('div.income-item');
    expect(incomes.length).toBe(0);

    const noIncome = nativeElement.querySelector('#no-income');
    expect(noIncome.textContent).toContain('Aucun revenu\u00A0!');
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

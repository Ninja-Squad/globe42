import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeModel } from '../models/income.model';
import { ConfirmService } from '../confirm.service';
import { IncomeService } from '../income.service';
import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person-incomes',
  templateUrl: './person-incomes.component.html',
  styleUrls: ['./person-incomes.component.scss']
})
export class PersonIncomesComponent {

  person: PersonModel;
  incomes: Array<IncomeModel>;

  constructor(route: ActivatedRoute, private incomeService: IncomeService, private confirmService: ConfirmService) {
    this.incomes = route.snapshot.data['incomes'];
    this.person = route.parent.snapshot.data['person'];
  }

  delete(income: IncomeModel) {
    this.confirmService.confirm({ message: `Voulez-vous vraiment supprimer le revenu ${income.source.name}\u00A0?`})
      .switchMap(() => this.incomeService.delete(this.person.id, income.id))
      .switchMap(() => this.incomeService.list(this.person.id))
      .subscribe(incomes => this.incomes = incomes, () => {});
  }

  totalMonthlyAmount() {
    return this.incomes.map(income => income.monthlyAmount).reduce((sum, value) => sum + value);
  }
}

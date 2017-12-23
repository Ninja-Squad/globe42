import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeModel } from '../models/income.model';
import { ConfirmService } from '../confirm.service';
import { IncomeService } from '../income.service';
import { PersonModel } from '../models/person.model';
import { ChargeModel } from '../models/charge.model';
import { ChargeService } from '../charge.service';

@Component({
  selector: 'gl-person-resources',
  templateUrl: './person-resources.component.html',
  styleUrls: ['./person-resources.component.scss']
})
export class PersonResourcesComponent {

  person: PersonModel;
  incomes: Array<IncomeModel>;
  charges: Array<ChargeModel>;

  constructor(route: ActivatedRoute,
              private incomeService: IncomeService,
              private chargeService: ChargeService,
              private confirmService: ConfirmService) {
    this.incomes = route.snapshot.data['incomes'];
    this.charges = route.snapshot.data['charges'];
    this.person = route.parent.snapshot.data['person'];
  }

  deleteIncome(income: IncomeModel) {
    this.confirmService.confirm({ message: `Voulez-vous vraiment supprimer le revenu ${income.source.name}\u00A0?`})
      .switchMap(() => this.incomeService.delete(this.person.id, income.id))
      .switchMap(() => this.incomeService.list(this.person.id))
      .subscribe(incomes => this.incomes = incomes, () => {});
  }

  deleteCharge(charge: ChargeModel) {
    this.confirmService.confirm({ message: `Voulez-vous vraiment supprimer la charge ${charge.type.name}\u00A0?`})
      .switchMap(() => this.chargeService.delete(this.person.id, charge.id))
      .switchMap(() => this.chargeService.list(this.person.id))
      .subscribe(charges => this.charges = charges, () => {});
  }

  totalMonthlyIncomeAmount() {
    return this.incomes.map(income => income.monthlyAmount).reduce((sum, value) => sum + value, 0);
  }

  totalMonthlyChargeAmount() {
    return this.charges.map(charge => charge.monthlyAmount).reduce((sum, value) => sum + value, 0);
  }

  totalMonthlyAmount() {
    return this.totalMonthlyIncomeAmount() - this.totalMonthlyChargeAmount();
  }
}

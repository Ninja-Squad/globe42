import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeCommand } from '../models/income.command';
import { IncomeService } from '../income.service';
import { sortBy } from '../utils';

@Component({
  selector: 'gl-person-income-edit',
  templateUrl: './person-income-edit.component.html',
  styleUrls: ['./person-income-edit.component.scss']
})
export class PersonIncomeEditComponent implements OnInit {

  person: PersonModel;
  incomeSources: Array<IncomeSourceModel>;

  income: {
    source: IncomeSourceModel,
    monthlyAmount: number
  };

  constructor(private route: ActivatedRoute,
              private incomeService: IncomeService,
              private router: Router) { }

  ngOnInit() {
    this.person = this.route.snapshot.data['person'];
    this.incomeSources = this.route.snapshot.data['incomeSources'];
    sortBy(this.incomeSources, source => source.name);
    this.income = {
      source: null,
      monthlyAmount: null
    }
  }

  save() {
    const command: IncomeCommand = {
      sourceId: this.income.source.id,
      monthlyAmount: this.income.monthlyAmount
    };
    this.incomeService.create(this.person.id, command)
      .subscribe(() => this.router.navigate(['persons', this.person.id, 'incomes']));
  }
}

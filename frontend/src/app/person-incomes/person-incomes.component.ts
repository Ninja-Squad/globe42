import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeModel } from '../models/income.model';

@Component({
  selector: 'gl-person-incomes',
  templateUrl: './person-incomes.component.html',
  styleUrls: ['./person-incomes.component.scss']
})
export class PersonIncomesComponent {

  incomes: Array<IncomeModel>;

  constructor(route: ActivatedRoute) {
    this.incomes = route.snapshot.data['incomes'];
  }

}

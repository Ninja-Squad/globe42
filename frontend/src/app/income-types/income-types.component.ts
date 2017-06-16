import { Component, OnInit } from '@angular/core';
import { IncomeTypeModel } from 'app/models/income.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-income-types',
  templateUrl: './income-types.component.html',
  styleUrls: ['./income-types.component.scss']
})
export class IncomeTypesComponent implements OnInit {

  incomeTypes: Array<IncomeTypeModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.incomeTypes = this.route.snapshot.data['incomeTypes'];
  }

}

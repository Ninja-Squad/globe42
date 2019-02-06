import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';

@Component({
  selector: 'gl-income-types',
  templateUrl: './income-types.component.html',
  styleUrls: ['./income-types.component.scss']
})
export class IncomeTypesComponent implements OnInit {

  incomeTypes: Array<IncomeSourceTypeModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.incomeTypes = this.route.snapshot.data.incomeTypes;
  }

}

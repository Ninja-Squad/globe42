import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IncomeTypeModel } from '../models/income.model';
import { IncomeService } from '../income.service';

@Component({
  selector: 'gl-income-type-edit',
  templateUrl: './income-type-edit.component.html',
  styleUrls: ['./income-type-edit.component.scss']
})
export class IncomeTypeEditComponent implements OnInit {

  incomeType: IncomeTypeModel;
  actionFailed = false;

  constructor(private route: ActivatedRoute, private router: Router, private incomeService: IncomeService) { }

  ngOnInit() {
    this.incomeType = this.route.snapshot.data['incomeType'] || { type: '' };
  }

  create() {
    let action;
    if (this.incomeType && this.incomeType.id !== undefined) {
      action = this.incomeService.updateType(this.incomeType)
    } else {
      action = this.incomeService.createType(this.incomeType)
    }
    action.subscribe(
      () => this.router.navigateByUrl('/income-types'),
      error => this.actionFailed = true
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IncomeSourceTypeCommand } from '../models/income-source-type.command';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';

@Component({
  selector: 'gl-income-type-edit',
  templateUrl: './income-type-edit.component.html',
  styleUrls: ['./income-type-edit.component.scss']
})
export class IncomeTypeEditComponent implements OnInit {

  editedIncomeType: IncomeSourceTypeModel;
  incomeType: IncomeSourceTypeCommand;
  actionFailed = false;

  constructor(private route: ActivatedRoute, private router: Router, private incomeSourceTypeService: IncomeSourceTypeService) { }

  ngOnInit() {
    this.editedIncomeType = this.route.snapshot.data['incomeType'];
    this.incomeType = this.editedIncomeType ? { type: this.editedIncomeType.type } : { type: '' };
  }

  save() {
    let action;
    if (this.editedIncomeType) {
      action = this.incomeSourceTypeService.update(this.editedIncomeType.id, this.incomeType);
    } else {
      action = this.incomeSourceTypeService.create(this.incomeType);
    }
    action.subscribe(
      () => this.router.navigateByUrl('/income-types'),
      error => this.actionFailed = true
    );
  }

}

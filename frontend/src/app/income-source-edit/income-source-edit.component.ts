import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeService } from '../income.service';
import { sortBy } from '../utils';
import { IncomeSourceModel, IncomeSourceTypeModel } from '../models/income.model';
import { IncomeSourceCommand } from '../models/income-source.command';

@Component({
  selector: 'gl-income-source-edit',
  templateUrl: './income-source-edit.component.html',
  styleUrls: ['./income-source-edit.component.scss']
})
export class IncomeSourceEditComponent implements OnInit {

  private editedIncomeSource: IncomeSourceModel;

  incomeSourceTypes: Array<IncomeSourceTypeModel>;
  incomeSource: IncomeSourceCommand;

  constructor(private route: ActivatedRoute, private incomeService: IncomeService, private router: Router) { }

  ngOnInit() {
    this.incomeSourceTypes = this.route.snapshot.data['incomeSourceTypes'];
    sortBy(this.incomeSourceTypes, type => type.type);

    this.editedIncomeSource = this.route.snapshot.data['incomeSource'];

    if (this.editedIncomeSource) {
      this.incomeSource = {
        name: this.editedIncomeSource.name,
        typeId: this.editedIncomeSource.type.id,
        maxMonthlyAmount: this.editedIncomeSource.maxMonthlyAmount
      }
    }
    else {
      this.incomeSource = {
        name: '',
        typeId: null,
        maxMonthlyAmount: null
      }
    }
  }

  save() {
    let action;
    if (this.editedIncomeSource) {
      action = this.incomeService.updateSource(this.editedIncomeSource.id, this.incomeSource);
    }
    else {
      action = this.incomeService.createSource(this.incomeSource);
    }
    action.subscribe(() => this.router.navigate(['/income-sources']));
  }
}

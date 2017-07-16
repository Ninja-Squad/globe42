import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from '../utils';
import { IncomeSourceCommand } from '../models/income-source.command';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceService } from '../income-source.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'gl-income-source-edit',
  templateUrl: './income-source-edit.component.html',
  styleUrls: ['./income-source-edit.component.scss']
})
export class IncomeSourceEditComponent implements OnInit {

  editedIncomeSource: IncomeSourceModel;

  incomeSourceTypes: Array<IncomeSourceTypeModel>;
  incomeSource: IncomeSourceCommand;

  constructor(private route: ActivatedRoute,
              private incomeSourceService: IncomeSourceService,
              private router: Router,
              private errorService: ErrorService) { }

  ngOnInit() {
    this.incomeSourceTypes =
      sortBy<IncomeSourceTypeModel>(this.route.snapshot.data['incomeSourceTypes'], type => type.type);

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
      action = this.incomeSourceService.update(this.editedIncomeSource.id, this.incomeSource);
    }
    else {
      action = this.incomeSourceService.create(this.incomeSource);
    }
    action.subscribe(
      () => this.router.navigate(['/income-sources']),
      this.errorService.functionalErrorHandler());
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from '../utils';
import { IncomeSourceCommand } from '../models/income-source.command';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceService } from '../income-source.service';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-income-source-edit',
  templateUrl: './income-source-edit.component.html',
  styleUrls: ['./income-source-edit.component.scss']
})
export class IncomeSourceEditComponent implements OnInit {
  editedIncomeSource: IncomeSourceModel;

  incomeSourceTypes: Array<IncomeSourceTypeModel>;
  incomeSourceForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private incomeSourceService: IncomeSourceService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.incomeSourceTypes = sortBy<IncomeSourceTypeModel>(
      this.route.snapshot.data.incomeSourceTypes,
      type => type.type
    );

    this.editedIncomeSource = this.route.snapshot.data.incomeSource;

    this.incomeSourceForm = this.fb.group({
      name: [this.editedIncomeSource ? this.editedIncomeSource.name : '', Validators.required],
      typeId: [
        this.editedIncomeSource ? this.editedIncomeSource.type.id : null,
        Validators.required
      ],
      maxMonthlyAmount: [
        this.editedIncomeSource ? this.editedIncomeSource.maxMonthlyAmount : null,
        Validators.min(1)
      ]
    });
  }

  save() {
    if (this.incomeSourceForm.invalid) {
      return;
    }

    let action: Observable<IncomeSourceModel | void>;
    const command: IncomeSourceCommand = this.incomeSourceForm.value;

    if (this.editedIncomeSource) {
      action = this.incomeSourceService.update(this.editedIncomeSource.id, command);
    } else {
      action = this.incomeSourceService.create(command);
    }
    action.subscribe({
      next: () => this.router.navigate(['/income-sources']),
      error: this.errorService.functionalErrorHandler()
    });
  }
}

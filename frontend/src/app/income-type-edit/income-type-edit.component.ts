import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IncomeSourceTypeCommand } from '../models/income-source-type.command';
import { IncomeSourceTypeModel } from '../models/income-source-type.model';
import { IncomeSourceTypeService } from '../income-source-type.service';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-income-type-edit',
  templateUrl: './income-type-edit.component.html',
  styleUrls: ['./income-type-edit.component.scss']
})
export class IncomeTypeEditComponent implements OnInit {

  editedIncomeType: IncomeSourceTypeModel;
  incomeTypeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private incomeSourceTypeService: IncomeSourceTypeService,
              private errorService: ErrorService) { }

  ngOnInit() {
    this.editedIncomeType = this.route.snapshot.data['incomeType'];
    this.incomeTypeForm = this.fb.group({
      type: [this.editedIncomeType ? this.editedIncomeType.type : '', Validators.required]
    });
  }

  save() {
    if (this.incomeTypeForm.invalid) {
      return;
    }

    const command: IncomeSourceTypeCommand = this.incomeTypeForm.value;
    let action: Observable<IncomeSourceTypeModel | void>;
    if (this.editedIncomeType) {
      action = this.incomeSourceTypeService.update(this.editedIncomeType.id, command);
    } else {
      action = this.incomeSourceTypeService.create(command);
    }
    action.subscribe(
      () => this.router.navigateByUrl('/income-types'),
      this.errorService.functionalErrorHandler()
    );
  }

}

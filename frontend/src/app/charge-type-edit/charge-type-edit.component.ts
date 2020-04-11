import { Component, OnInit } from '@angular/core';
import { ChargeTypeModel } from '../models/charge-type.model';
import { sortBy } from '../utils';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { ChargeTypeCommand } from '../models/charge-type.command';
import { ChargeTypeService } from '../charge-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-charge-type-edit',
  templateUrl: './charge-type-edit.component.html',
  styleUrls: ['./charge-type-edit.component.scss']
})
export class ChargeTypeEditComponent implements OnInit {
  editedChargeType: ChargeTypeModel;

  chargeCategories: Array<ChargeCategoryModel>;
  chargeTypeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private chargeTypeService: ChargeTypeService,
    private router: Router,
    private fb: FormBuilder,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.chargeCategories = sortBy<ChargeCategoryModel>(
      this.route.snapshot.data.chargeCategories,
      category => category.name
    );

    this.editedChargeType = this.route.snapshot.data.chargeType;

    this.chargeTypeForm = this.fb.group({
      name: [this.editedChargeType ? this.editedChargeType.name : '', Validators.required],
      categoryId: [
        this.editedChargeType ? this.editedChargeType.category.id : null,
        Validators.required
      ],
      maxMonthlyAmount: [
        this.editedChargeType ? this.editedChargeType.maxMonthlyAmount : null,
        Validators.min(1)
      ]
    });
  }

  save() {
    if (this.chargeTypeForm.invalid) {
      return;
    }

    let action: Observable<ChargeTypeModel | void>;
    const command: ChargeTypeCommand = this.chargeTypeForm.value;
    if (this.editedChargeType) {
      action = this.chargeTypeService.update(this.editedChargeType.id, command);
    } else {
      action = this.chargeTypeService.create(command);
    }
    action.subscribe(
      () => this.router.navigate(['/charge-types']),
      this.errorService.functionalErrorHandler()
    );
  }
}

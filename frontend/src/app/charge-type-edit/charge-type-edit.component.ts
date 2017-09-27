import { Component, OnInit } from '@angular/core';
import { ChargeTypeModel } from '../models/charge-type.model';
import { sortBy } from '../utils';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { ChargeTypeCommand } from '../models/charge-type.command';
import { ChargeTypeService } from '../charge-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../error.service';

@Component({
  selector: 'gl-charge-type-edit',
  templateUrl: './charge-type-edit.component.html',
  styleUrls: ['./charge-type-edit.component.scss']
})
export class ChargeTypeEditComponent implements OnInit {

  editedChargeType: ChargeTypeModel;

  chargeCategories: Array<ChargeCategoryModel>;
  chargeType: ChargeTypeCommand;

  constructor(private route: ActivatedRoute,
              private chargeTypeService: ChargeTypeService,
              private router: Router,
              private errorService: ErrorService) { }

  ngOnInit() {
    this.chargeCategories =
      sortBy<ChargeCategoryModel>(this.route.snapshot.data['chargeCategories'], category => category.name);

    this.editedChargeType = this.route.snapshot.data['chargeType'];

    if (this.editedChargeType) {
      this.chargeType = {
        name: this.editedChargeType.name,
        categoryId: this.editedChargeType.category.id,
        maxMonthlyAmount: this.editedChargeType.maxMonthlyAmount
      };
    } else {
      this.chargeType = {
        name: '',
        categoryId: null,
        maxMonthlyAmount: null
      };
    }
  }

  save() {
    let action;
    if (this.editedChargeType) {
      action = this.chargeTypeService.update(this.editedChargeType.id, this.chargeType);
    } else {
      action = this.chargeTypeService.create(this.chargeType);
    }
    action.subscribe(
      () => this.router.navigate(['/charge-types']),
      this.errorService.functionalErrorHandler());
  }
}

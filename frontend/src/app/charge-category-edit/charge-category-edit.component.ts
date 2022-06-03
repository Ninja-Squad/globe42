import { Component, OnInit } from '@angular/core';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { ChargeCategoryCommand } from '../models/charge-category.command';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeCategoryService } from '../charge-category.service';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-charge-category-edit',
  templateUrl: './charge-category-edit.component.html',
  styleUrls: ['./charge-category-edit.component.scss']
})
export class ChargeCategoryEditComponent implements OnInit {
  editedChargeCategory: ChargeCategoryModel;
  chargeCategoryForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private chargeCategoryService: ChargeCategoryService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.editedChargeCategory = this.route.snapshot.data.chargeCategory;
    this.chargeCategoryForm = this.fb.group({
      name: [this.editedChargeCategory ? this.editedChargeCategory.name : '', Validators.required]
    });
  }

  save() {
    if (this.chargeCategoryForm.invalid) {
      return;
    }

    let action: Observable<ChargeCategoryModel | void>;
    const command: ChargeCategoryCommand = this.chargeCategoryForm.value;
    if (this.editedChargeCategory) {
      action = this.chargeCategoryService.update(this.editedChargeCategory.id, command);
    } else {
      action = this.chargeCategoryService.create(command);
    }
    action.subscribe({
      next: () => this.router.navigateByUrl('/charge-categories'),
      error: this.errorService.functionalErrorHandler()
    });
  }
}

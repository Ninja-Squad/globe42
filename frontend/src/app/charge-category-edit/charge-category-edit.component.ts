import { Component, OnInit } from '@angular/core';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { ChargeCategoryCommand } from '../models/charge-category.command';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeCategoryService } from '../charge-category.service';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'gl-charge-category-edit',
  templateUrl: './charge-category-edit.component.html',
  styleUrls: ['./charge-category-edit.component.scss']
})
export class ChargeCategoryEditComponent implements OnInit {
  editedChargeCategory: ChargeCategoryModel;
  chargeCategory: ChargeCategoryCommand;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private chargeCategoryService: ChargeCategoryService,
              private errorService: ErrorService) { }

  ngOnInit() {
    this.editedChargeCategory = this.route.snapshot.data['chargeCategory'];
    this.chargeCategory = this.editedChargeCategory ? { name: this.editedChargeCategory.name } : { name: '' };
  }

  save() {
    let action: Observable<ChargeCategoryModel | void>;
    if (this.editedChargeCategory) {
      action = this.chargeCategoryService.update(this.editedChargeCategory.id, this.chargeCategory);
    } else {
      action = this.chargeCategoryService.create(this.chargeCategory);
    }
    action.subscribe(
      () => this.router.navigateByUrl('/charge-categories'),
      this.errorService.functionalErrorHandler()
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ChargeCategoryModel } from '../models/charge-category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-charge-categories',
  templateUrl: './charge-categories.component.html',
  styleUrls: ['./charge-categories.component.scss']
})
export class ChargeCategoriesComponent implements OnInit {

  chargeCategories: Array<ChargeCategoryModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.chargeCategories = this.route.snapshot.data['chargeCategories'];
  }
}

import { Component, OnInit } from '@angular/core';
import { ChargeTypeModel } from '../models/charge-type.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-charge-types',
  templateUrl: './charge-types.component.html',
  styleUrls: ['./charge-types.component.scss']
})
export class ChargeTypesComponent implements OnInit {

  chargeTypes: Array<ChargeTypeModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.chargeTypes = this.route.snapshot.data['chargeTypes'];
  }

}

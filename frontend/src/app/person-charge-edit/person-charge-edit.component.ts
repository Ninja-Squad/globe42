import { Component, OnInit } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ChargeTypeModel } from '../models/charge-type.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeService } from '../charge.service';
import { sortBy } from '../utils';
import { ChargeCommand } from '../models/charge.command';

@Component({
  selector: 'gl-person-charge-edit',
  templateUrl: './person-charge-edit.component.html',
  styleUrls: ['./person-charge-edit.component.scss']
})
export class PersonChargeEditComponent implements OnInit {

  person: PersonModel;
  chargeTypes: Array<ChargeTypeModel>;

  charge: {
    type: ChargeTypeModel,
    monthlyAmount: number
  };

  constructor(private route: ActivatedRoute,
              private chargeService: ChargeService,
              private router: Router) { }

  ngOnInit() {
    this.person = this.route.snapshot.data['person'];
    this.chargeTypes = sortBy<ChargeTypeModel>(this.route.snapshot.data['chargeTypes'], type => type.name);
    this.charge = {
      type: null,
      monthlyAmount: null
    };
  }

  save() {
    const command: ChargeCommand = {
      typeId: this.charge.type.id,
      monthlyAmount: this.charge.monthlyAmount
    };
    this.chargeService.create(this.person.id, command)
      .subscribe(() => this.router.navigate(['persons', this.person.id, 'resources']));
  }
}

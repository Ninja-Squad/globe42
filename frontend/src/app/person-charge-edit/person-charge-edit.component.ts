import { Component, OnInit } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ChargeTypeModel } from '../models/charge-type.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeService } from '../charge.service';
import { sortBy } from '../utils';
import { ChargeCommand } from '../models/charge.command';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'gl-person-charge-edit',
  templateUrl: './person-charge-edit.component.html',
  styleUrls: ['./person-charge-edit.component.scss']
})
export class PersonChargeEditComponent implements OnInit {

  person: PersonModel;
  chargeTypes: Array<ChargeTypeModel>;

  chargeForm: FormGroup;

  private monthlyAmountValidator: ValidatorFn = (control: AbstractControl) => {
    if (!this.selectedChargeType || !this.selectedChargeType.maxMonthlyAmount) {
      return null;
    }

    return Validators.max(this.selectedChargeType.maxMonthlyAmount)(control);
  }

  constructor(private route: ActivatedRoute,
              private chargeService: ChargeService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
    this.chargeTypes = sortBy<ChargeTypeModel>(this.route.snapshot.data.chargeTypes, type => type.name);
    this.chargeForm = this.fb.group({
      type: [null, Validators.required],
      monthlyAmount: [null, Validators.compose([Validators.required, this.monthlyAmountValidator, Validators.min(1)])]
    });

    this.chargeForm.get('type').valueChanges.subscribe(() => this.monthlyAmountCtrl.updateValueAndValidity());
  }

  get selectedChargeType(): ChargeTypeModel | null {
    return this.chargeForm && this.chargeForm.get('type').value;
  }

  get monthlyAmountCtrl(): FormControl {
    return this.chargeForm.get('monthlyAmount') as FormControl;
  }

  save() {
    if (this.chargeForm.invalid) {
      return;
    }

    const formValue = this.chargeForm.value;
    const command: ChargeCommand = {
      typeId: formValue.type.id,
      monthlyAmount: formValue.monthlyAmount
    };

    this.chargeService.create(this.person.id, command)
      .subscribe(() => this.router.navigate(['persons', this.person.id, 'resources']));
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeCommand } from '../models/income.command';
import { IncomeService } from '../income.service';
import { sortBy } from '../utils';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'gl-person-income-edit',
  templateUrl: './person-income-edit.component.html',
  styleUrls: ['./person-income-edit.component.scss']
})
export class PersonIncomeEditComponent implements OnInit {

  person: PersonModel;
  incomeSources: Array<IncomeSourceModel>;
  incomeForm: FormGroup;

  private monthlyAmountValidator: ValidatorFn = (control: AbstractControl) => {
    if (!(this.selectedSource?.maxMonthlyAmount)) {
      return null;
    }

    return Validators.max(this.selectedSource.maxMonthlyAmount)(control);
  }

  constructor(private route: ActivatedRoute,
              private incomeService: IncomeService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
    this.incomeSources = sortBy<IncomeSourceModel>(this.route.snapshot.data.incomeSources, source => source.name);
    this.incomeForm = this.fb.group({
      source: [null, Validators.required],
      monthlyAmount: [null, Validators.compose([Validators.required, this.monthlyAmountValidator, Validators.min(1)])]
    });

    this.incomeForm.get('source').valueChanges.subscribe(() => this.monthlyAmountCtrl.updateValueAndValidity());
  }

  get selectedSource(): IncomeSourceModel | null {
    return this.incomeForm?.get('source').value ?? null;
  }

  get monthlyAmountCtrl(): FormControl {
    return this.incomeForm.get('monthlyAmount') as FormControl;
  }

  save() {
    if (this.incomeForm.invalid) {
      return;
    }

    const formValue = this.incomeForm.value;
    const command: IncomeCommand = {
      sourceId: formValue.source.id,
      monthlyAmount: formValue.monthlyAmount
    };
    this.incomeService.create(this.person.id, command)
      .subscribe(() => this.router.navigate(['persons', this.person.id, 'resources']));
  }
}

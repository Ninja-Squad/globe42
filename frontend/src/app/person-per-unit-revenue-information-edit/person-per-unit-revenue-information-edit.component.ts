import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { PerUnitRevenueInformationService } from '../per-unit-revenue-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-person-per-unit-revenue-information-edit',
  templateUrl: './person-per-unit-revenue-information-edit.component.html',
  styleUrls: ['./person-per-unit-revenue-information-edit.component.scss']
})
export class PersonPerUnitRevenueInformationEditComponent implements OnInit {
  person: PersonModel;
  infoGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private perUnitRevenueInformationService: PerUnitRevenueInformationService,
    private router: Router,
    fb: FormBuilder
  ) {
    this.infoGroup = fb.group({
      adultLikeCount: [1, [Validators.required, Validators.min(1)]],
      childCount: [0, [Validators.required, Validators.min(0)]],
      monoParental: [false]
    });
  }

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
    const info = this.route.snapshot.data.perUnitRevenueInformation;
    if (info) {
      this.infoGroup.setValue(info);
    }
  }

  save() {
    const info = this.infoGroup.value;
    this.perUnitRevenueInformationService
      .update(this.person.id, info)
      .subscribe(() => this.router.navigate(['/persons', this.person.id, 'resources']));
  }
}

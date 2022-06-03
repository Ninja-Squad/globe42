import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FamilyModel } from '../models/family.model';
import { FamilyService } from '../family.service';

@Component({
  selector: 'gl-person-family-edit',
  templateUrl: './person-family-edit.component.html',
  styleUrls: ['./person-family-edit.component.scss']
})
export class PersonFamilyEditComponent implements OnInit {
  person: PersonModel;
  familyForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private familyService: FamilyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
    const family: FamilyModel = this.route.snapshot.data.family;

    this.familyForm = this.fb.group({
      spouseLocation: family ? family.spouseLocation : null,
      relatives: this.fb.array(
        family
          ? family.relatives.map(relative =>
              this.fb.group({
                type: relative.type,
                firstName: relative.firstName,
                birthDate: relative.birthDate,
                location: relative.location
              })
            )
          : []
      )
    });
  }

  get relatives(): UntypedFormArray {
    return this.familyForm.get('relatives') as UntypedFormArray;
  }

  addRelative(type: 'CHILD' | 'BROTHER' | 'SISTER') {
    this.relatives.push(
      this.fb.group({
        type,
        firstName: null,
        birthDate: null,
        location: 'FRANCE'
      })
    );
  }

  removeRelative(index: number) {
    this.relatives.removeAt(index);
  }

  save() {
    this.familyService
      .save(this.person.id, this.familyForm.value)
      .subscribe(() => this.router.navigate(['/persons', this.person.id, 'family']));
  }
}

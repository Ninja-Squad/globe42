import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FamilyModel } from '../models/family.model';
import { FamilyService } from '../family.service';

@Component({
  selector: 'gl-person-family-edit',
  templateUrl: './person-family-edit.component.html',
  styleUrls: ['./person-family-edit.component.scss']
})
export class PersonFamilyEditComponent implements OnInit {
  person: PersonModel;
  familyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private familyService: FamilyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
    const family: FamilyModel = this.route.snapshot.data.family;

    this.familyForm = this.fb.group({
      spouseLocation: family ? family.spouseLocation : null,
      children: this.fb.array(
        family
          ? family.children.map(child =>
              this.fb.group({
                firstName: child.firstName,
                birthDate: child.birthDate,
                location: child.location
              })
            )
          : []
      )
    });
  }

  get children(): FormArray {
    return this.familyForm.get('children') as FormArray;
  }

  addChild() {
    this.children.push(
      this.fb.group({
        firstName: null,
        birthDate: null,
        location: 'FRANCE'
      })
    );
  }

  removeChild(index: number) {
    this.children.removeAt(index);
  }

  save() {
    this.familyService
      .save(this.person.id, this.familyForm.value)
      .subscribe(() => this.router.navigate(['/persons', this.person.id, 'family']));
  }
}

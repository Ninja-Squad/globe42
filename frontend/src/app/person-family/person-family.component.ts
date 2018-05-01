import { Component, OnInit } from '@angular/core';
import { ChildModel, FamilyModel } from '../models/family.model';
import { ActivatedRoute } from '@angular/router';
import { FamilyService } from '../family.service';
import { PersonModel } from '../models/person.model';
import { ConfirmService } from '../confirm.service';
import { switchMap } from 'rxjs/operators';

export interface Situation {
  parentPresent: boolean;
  spousePresent: boolean;
  children: Array<ChildModel>;
}

@Component({
  selector: 'gl-person-family',
  templateUrl: './person-family.component.html',
  styleUrls: ['./person-family.component.scss']
})
export class PersonFamilyComponent implements OnInit {

  person: PersonModel;
  family: FamilyModel;
  france: Situation;
  abroad: Situation;

  constructor(private route: ActivatedRoute,
              private familyService: FamilyService,
              private confirmService: ConfirmService) { }

  ngOnInit() {
    this.person = this.route.snapshot.parent.data.person;
    this.family = this.route.snapshot.data.family;
    if (this.family) {
      this.france = {
        parentPresent: this.family.parentInFrance,
        spousePresent: this.family.spouseLocation === 'FRANCE',
        children: this.family.children.filter(child => child.location === 'FRANCE')
      };

      this.abroad = {
        parentPresent: this.family.parentAbroad,
        spousePresent: this.family.spouseLocation === 'ABROAD',
        children: this.family.children.filter(child => child.location === 'ABROAD')
      };
    }
  }

  delete() {
    this.confirmService.confirm({
      message: 'Voulez-vous vraiment supprimer la situation familiale\u00a0?'
    }).pipe(
      switchMap(() => this.familyService.delete(this.person.id))
    ).subscribe(() => {
      this.family = null;
      this.france = null;
      this.abroad = null;
    });
  }
}

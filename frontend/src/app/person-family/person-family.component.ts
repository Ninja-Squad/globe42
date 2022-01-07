import { Component, OnInit } from '@angular/core';
import { FamilyModel, RelativeModel } from '../models/family.model';
import { ActivatedRoute } from '@angular/router';
import { FamilyService } from '../family.service';
import { PersonModel } from '../models/person.model';
import { ConfirmService } from '../confirm.service';
import { switchMap } from 'rxjs';
import { CurrentPersonService } from '../current-person.service';

export interface Situation {
  spousePresent: boolean;
  children: Array<RelativeModel>;
  brothers: Array<RelativeModel>;
  sisters: Array<RelativeModel>;
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

  constructor(
    private currentPersonService: CurrentPersonService,
    private route: ActivatedRoute,
    private familyService: FamilyService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.person = this.currentPersonService.snapshot;
    this.family = this.route.snapshot.data.family;
    if (this.family) {
      this.france = {
        spousePresent: this.family.spouseLocation === 'FRANCE',
        children: this.family.relatives.filter(
          relative => relative.location === 'FRANCE' && relative.type === 'CHILD'
        ),
        brothers: this.family.relatives.filter(
          relative => relative.location === 'FRANCE' && relative.type === 'BROTHER'
        ),
        sisters: this.family.relatives.filter(
          relative => relative.location === 'FRANCE' && relative.type === 'SISTER'
        )
      };

      this.abroad = {
        spousePresent: this.family.spouseLocation === 'ABROAD',
        children: this.family.relatives.filter(
          relative => relative.location === 'ABROAD' && relative.type === 'CHILD'
        ),
        brothers: this.family.relatives.filter(
          relative => relative.location === 'ABROAD' && relative.type === 'BROTHER'
        ),
        sisters: this.family.relatives.filter(
          relative => relative.location === 'ABROAD' && relative.type === 'SISTER'
        )
      };
    }
  }

  delete() {
    this.confirmService
      .confirm({
        message: 'Voulez-vous vraiment supprimer la situation familiale\u00a0?'
      })
      .pipe(switchMap(() => this.familyService.delete(this.person.id)))
      .subscribe(() => {
        this.family = null;
        this.france = null;
        this.abroad = null;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent {

  person: PersonModel;

  constructor(private route: ActivatedRoute) {
    this.person = route.snapshot.data['person'];
  }
}

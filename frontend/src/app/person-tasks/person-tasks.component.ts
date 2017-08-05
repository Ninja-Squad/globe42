import { Component, OnInit } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-person-tasks',
  templateUrl: './person-tasks.component.html',
  styleUrls: ['./person-tasks.component.scss']
})
export class PersonTasksComponent {

  person: PersonModel;

  constructor(route: ActivatedRoute) {
    this.person = route.parent.snapshot.data['person'];
  }
}

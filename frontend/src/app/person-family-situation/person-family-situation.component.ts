import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person-family-situation',
  templateUrl: './person-family-situation.component.html',
  styleUrls: ['./person-family-situation.component.scss']
})
export class PersonFamilySituationComponent implements OnInit {

  person: PersonModel;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.person = this.route.parent.snapshot.data['person'];
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  person: PersonModel;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.person = this.route.snapshot.data['person'];
  }

}

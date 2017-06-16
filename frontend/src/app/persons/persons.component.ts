import { Component, OnInit } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  persons: Array<PersonModel> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.persons = this.route.snapshot.data['persons'];
  }

}

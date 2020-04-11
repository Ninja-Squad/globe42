import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person-membership-print',
  templateUrl: './person-membership-print.component.html',
  styleUrls: ['./person-membership-print.component.scss']
})
export class PersonMembershipPrintComponent implements OnInit {
  person: PersonModel;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.person = this.route.snapshot.data.person;
  }

  print() {
    window.print();
  }
}

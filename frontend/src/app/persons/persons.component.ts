import { Component, OnInit } from '@angular/core';
import { PersonIdentityModel } from '../models/person.model';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from '../utils';
import { displayFullname } from '../fullname.pipe';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'gl-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  persons: Array<PersonIdentityModel> = [];
  filterCtrl = new FormControl('');

  private allPersons: Array<PersonIdentityModel> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.allPersons = sortBy<PersonIdentityModel>(this.route.snapshot.data['persons'], displayFullname);
    this.filterCtrl.valueChanges.subscribe(text => this.filter(text));
    this.filter('');
  }

  private filter(text: string) {
    const value = text.trim().toLowerCase();
    if (!value) {
      this.persons = this.allPersons;
      return;
    }

    this.persons = this.allPersons.filter(p =>
      this.includes(p.firstName, value) ||
      this.includes(p.lastName, value) ||
      this.includes(p.nickName, value) ||
      this.includes(p.mediationCode, value));
  }

  private includes(s: string, searchString: string): boolean {
    return s && s.toLowerCase().includes(searchString);
  }
}

import { Component, OnInit } from '@angular/core';
import { PersonIdentityModel } from '../models/person.model';
import { ActivatedRoute } from '@angular/router';
import { sortBy } from '../utils';
import { FullnamePipe } from '../fullname.pipe';
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

  constructor(private route: ActivatedRoute, private fullnamePipe: FullnamePipe) { }

  ngOnInit() {
    this.allPersons = sortBy<PersonIdentityModel>(this.route.snapshot.data['persons'],
      p => this.fullnamePipe.transform(p));
    this.filterCtrl.valueChanges.subscribe(text => this.filter(text));
    this.filter('');
  }

  private filter(text) {
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

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.allPersons = sortBy<PersonIdentityModel>(
      this.route.snapshot.data.persons,
      displayFullname
    );
    this.filterCtrl.valueChanges.subscribe(text => this.filter(text));
    this.filter('');
  }

  private filter(text: string) {
    const value = text.trim().toLowerCase();
    if (!value) {
      this.persons = this.allPersons;
      return;
    }

    const valueSanitizedForPhoneFiltering = this.sanitizeForPhoneFiltering(text);

    this.persons = this.allPersons.filter(
      p =>
        this.includes(p.firstName, value) ||
        this.includes(p.lastName, value) ||
        this.includes(p.nickName, value) ||
        this.includes(p.mediationCode, value) ||
        this.phoneMatches(p.phoneNumber, valueSanitizedForPhoneFiltering)
    );
  }

  private includes(s: string, searchString: string): boolean {
    return s?.toLowerCase().includes(searchString);
  }

  private phoneMatches(phoneNumber: string | null, phonePart: string) {
    if (!phoneNumber || !phonePart) {
      return false;
    }

    const sanitizedPhoneNumber = this.sanitizeForPhoneFiltering(phoneNumber);
    if (!sanitizedPhoneNumber) {
      return false;
    }

    return sanitizedPhoneNumber.includes(phonePart);
  }

  private sanitizeForPhoneFiltering(phoneNumber: string) {
    let result = '';
    for (let i = 0; i < phoneNumber.length; i++) {
      const char = phoneNumber.charAt(i);
      if (char >= '0' && char <= '9') {
        result += char;
      }
    }
    return result;
  }
}

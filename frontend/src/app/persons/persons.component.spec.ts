import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonsComponent } from './persons.component';
import { FullnamePipe } from '../fullname.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentTester } from 'ngx-speculoos';
import { PersonIdentityModel } from '../models/person.model';

class PersonsComponentTester extends ComponentTester<PersonsComponent> {
  constructor() {
    super(PersonsComponent);
  }

  get personItems() {
    return this.elements('.person-item');
  }

  get filter() {
    return this.input('#filter-input');
  }
}

describe('PersonsComponent', () => {
  let activatedRoute: any;
  let tester: PersonsComponentTester;

  beforeEach(() => {
    activatedRoute = {
      snapshot: {
        data: {
          persons: [
            {
              firstName: 'John',
              lastName: 'Doe',
              nickName: 'JD',
              mediationCode: 'D1',
              phoneNumber: null
            },
            {
              firstName: 'Abe',
              lastName: 'Dean',
              nickName: 'AD',
              mediationCode: 'D2',
              phoneNumber: '06 04 87 56 42'
            }
          ] as Array<PersonIdentityModel>
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [PersonsComponent, FullnamePipe],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });

    tester = new PersonsComponentTester();
    tester.detectChanges();
  });

  it('should expose persons sorted by full name', () => {
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2', 'D1']);
  });

  it('should filter by first name, ignoring case', () => {
    tester.componentInstance.filterCtrl.setValue('ab');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by last name, ignoring case', () => {
    tester.componentInstance.filterCtrl.setValue('ea');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by nick name, ignoring case', () => {
    tester.componentInstance.filterCtrl.setValue('ad');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by mediation code, ignoring case', () => {
    tester.componentInstance.filterCtrl.setValue('d2');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by phone number, excluding non-digit characters', () => {
    tester.componentInstance.filterCtrl.setValue(' 06-04');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);

    tester.componentInstance.filterCtrl.setValue(' 06-03');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual([]);

    tester.componentInstance.filterCtrl.setValue('Abcd');
    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual([]);
  });

  it('should not blow up when filtering if no first name', () => {
    tester.componentInstance.persons[0].firstName = null;
    tester.componentInstance.persons[1].firstName = null;
    tester.componentInstance.filterCtrl.setValue('d2');

    expect(tester.componentInstance.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should list persons', () => {
    expect(tester.personItems.length).toBe(2);
    expect(tester.personItems[1]).toContainText('John Doe (JD)');
    expect(tester.personItems[1]).toContainText('D1');
  });

  it('should filter', () => {
    tester.filter.fillWith('jo');

    expect(tester.personItems.length).toBe(1);
    expect(tester.personItems[0]).toContainText('John Doe (JD)');
    expect(tester.personItems[0]).toContainText('D1');
  });
});

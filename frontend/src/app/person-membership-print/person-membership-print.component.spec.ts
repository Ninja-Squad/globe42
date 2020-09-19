import { PersonModel } from '../models/person.model';
import { TestBed } from '@angular/core/testing';
import { PersonMembershipPrintComponent } from './person-membership-print.component';
import { ActivatedRoute } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { ComponentTester } from 'ngx-speculoos';

class PersonMembershipPrintComponentTester extends ComponentTester<PersonMembershipPrintComponent> {
  constructor() {
    super(PersonMembershipPrintComponent);
  }

  get fields() {
    return this.elements('.field');
  }
}

describe('PersonMembershipPrintComponent', () => {
  let person: PersonModel;
  let tester: PersonMembershipPrintComponentTester;

  beforeEach(() => {
    person = {
      id: 42
    } as PersonModel;

    const route: any = {
      snapshot: {
        data: {
          person
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [PersonMembershipPrintComponent, PageTitleDirective, FullnamePipe],
      providers: [{ provide: ActivatedRoute, useFactory: () => route }]
    });

    tester = new PersonMembershipPrintComponentTester();
  });

  it('should display all the fields with a non-breaking space to make sure borders display correctly', () => {
    tester.detectChanges();

    for (const field of tester.fields) {
      expect(field).toContainText('\u00a0');
    }
  });

  it('should display the information of a person', () => {
    person.firstName = 'John';
    person.lastName = 'Doe';
    person.birthDate = '1970-01-20';
    person.address = 'Main street';
    person.city = {
      code: 4000,
      city: 'ST-ETIENNE'
    };
    person.email = 'john.doe@gmail.com';
    person.phoneNumber = '0123456789';

    tester.detectChanges();

    expect(tester.fields[0]).toContainText('DOE');
    expect(tester.fields[1]).toContainText('JOHN');
    expect(tester.fields[2]).toContainText('20/01/1970');
    expect(tester.fields[4]).toContainText(person.address);
    expect(tester.fields[5]).toContainText('4000 ST-ETIENNE');
    expect(tester.fields[6]).toContainText(person.email);
    expect(tester.fields[7]).toContainText(person.phoneNumber);
  });
});

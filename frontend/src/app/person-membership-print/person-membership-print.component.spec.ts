import { PersonModel } from '../models/person.model';
import { async, TestBed } from '@angular/core/testing';
import { PersonMembershipPrintComponent } from './person-membership-print.component';
import { ActivatedRoute } from '@angular/router';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';

describe('PersonMembershipPrintComponent', () => {
  let person: PersonModel;

  beforeEach(async(() => {
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
      providers: [
        { provide: ActivatedRoute, useFactory: () => route }
      ]
    });
  }));

  it('should display all the fields with a non-breaking space to make sure borders display correctly', () => {
    const fixture = TestBed.createComponent(PersonMembershipPrintComponent);
    fixture.detectChanges();

    const fields = fixture.nativeElement.querySelectorAll('.field');

    for (const field of fields) {
      expect(field.textContent).toContain('\u00a0');
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

    const fixture = TestBed.createComponent(PersonMembershipPrintComponent);
    fixture.detectChanges();

    const fields = fixture.nativeElement.querySelectorAll('.field');
    expect(fields[0].textContent).toContain('DOE');
    expect(fields[1].textContent).toContain('JOHN');
    expect(fields[2].textContent).toContain('20/01/1970');
    expect(fields[4].textContent).toContain(person.address);
    expect(fields[5].textContent).toContain('4000 ST-ETIENNE');
    expect(fields[6].textContent).toContain(person.email);
    expect(fields[7].textContent).toContain(person.phoneNumber);
  });
});

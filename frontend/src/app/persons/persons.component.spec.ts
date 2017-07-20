import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonsComponent } from './persons.component';
import { FullnamePipe } from '../fullname.pipe';

describe('PersonsComponent', () => {
  const activatedRoute = {
    snapshot: { data: { persons: [{ firstName: 'John', lastName: 'Doe', nickName: 'JD', mediationCode: 'D1' }] } }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [PersonsComponent, FullnamePipe],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  })));

  it('should list persons', () => {
    const fixture = TestBed.createComponent(PersonsComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const persons = nativeElement.querySelectorAll('.person-item');
    expect(persons.length).toBe(1);

    expect(persons[0].textContent).toContain('John Doe (JD)');
    expect(persons[0].textContent).toContain('D1');
  });
});

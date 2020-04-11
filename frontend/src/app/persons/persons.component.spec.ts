import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonsComponent } from './persons.component';
import { FullnamePipe } from '../fullname.pipe';
import { ReactiveFormsModule } from '@angular/forms';

describe('PersonsComponent', () => {
  let activatedRoute: any;

  beforeEach(async(() => {
    activatedRoute = {
      snapshot: {
        data: {
          persons: [
            { firstName: 'John', lastName: 'Doe', nickName: 'JD', mediationCode: 'D1' },
            { firstName: 'Abe', lastName: 'Dean', nickName: 'AD', mediationCode: 'D2' }
          ]
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [PersonsComponent, FullnamePipe],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    });
  }));

  it('should expose persons sorted by full name', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2', 'D1']);
  });

  it('should filter by first name, ignoring case', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();

    component.filterCtrl.setValue('ab');

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by last name, ignoring case', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();

    component.filterCtrl.setValue('ea');

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by nick name, ignoring case', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();

    component.filterCtrl.setValue('ad');

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should filter by mediation code, ignoring case', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();

    component.filterCtrl.setValue('d2');

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should not blow up when filtering if no first name', () => {
    const component = new PersonsComponent(activatedRoute);
    component.ngOnInit();
    component.persons[0].firstName = null;
    component.persons[1].firstName = null;

    component.filterCtrl.setValue('d2');

    expect(component.persons.map(p => p.mediationCode)).toEqual(['D2']);
  });

  it('should list persons', () => {
    const fixture = TestBed.createComponent(PersonsComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const persons = nativeElement.querySelectorAll('.person-item');
    expect(persons.length).toBe(2);

    expect(persons[1].textContent).toContain('John Doe (JD)');
    expect(persons[1].textContent).toContain('D1');
  });

  it('should filter', () => {
    const fixture = TestBed.createComponent(PersonsComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const filterInput: HTMLInputElement = nativeElement.querySelector('#filter-input');
    filterInput.value = 'jo';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const persons = nativeElement.querySelectorAll('.person-item');
    expect(persons.length).toBe(1);

    expect(persons[0].textContent).toContain('John Doe (JD)');
    expect(persons[0].textContent).toContain('D1');
  });
});

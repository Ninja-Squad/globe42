import { TestBed } from '@angular/core/testing';

import { RelativeComponent } from './relative.component';
import { Component, LOCALE_ID } from '@angular/core';
import { RelativeModel } from '../../models/family.model';
import { ComponentTester } from 'ngx-speculoos';
import { DateTime } from 'luxon';

@Component({
  template: '<gl-relative [relative]="relative"></gl-relative>'
})
class TestComponent {
  relative: RelativeModel;
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }
}

describe('RelativeComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelativeComponent, TestComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    jasmine.clock().mockDate(DateTime.fromISO('2018-05-01').toJSDate());

    tester = new TestComponentTester();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should display relative with only first name', () => {
    tester.componentInstance.relative = {
      type: 'CHILD',
      firstName: 'John',
      birthDate: null,
      location: 'ABROAD'
    };
    tester.detectChanges();

    expect(tester.testElement).toContainText('John');
  });

  it('should display relative with only birth date', () => {
    tester.componentInstance.relative = {
      type: 'CHILD',
      firstName: null,
      birthDate: '2000-11-30',
      location: 'ABROAD'
    };
    tester.detectChanges();

    expect(tester.testElement.textContent.trim()).toMatch(/30 nov\. 2000\s+–\s+17 ans/);
  });

  it('should display relative with first name and birth date', () => {
    tester.componentInstance.relative = {
      type: 'CHILD',
      firstName: 'John',
      birthDate: '2000-11-30',
      location: 'ABROAD'
    };
    tester.detectChanges();

    expect(tester.testElement.textContent.trim()).toMatch(/John\s+–\s+30 nov\. 2000\s+–\s+17 ans/);
  });
});

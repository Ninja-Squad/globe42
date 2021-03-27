import { TestBed } from '@angular/core/testing';
import { Component, LOCALE_ID } from '@angular/core';
import { SituationComponent } from './situation.component';
import { Situation } from '../person-family.component';
import { DateTime } from 'luxon';
import { ComponentTester } from 'ngx-speculoos';

@Component({
  template: `<gl-situation [situation]="situation"></gl-situation>`
})
class TestComponent {
  situation: Situation;
}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get listItems() {
    return this.elements('li');
  }
}

describe('SituationComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationComponent, TestComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    jasmine.clock().mockDate(DateTime.fromISO('2018-05-01').toJSDate());

    tester = new TestComponentTester();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should display family situation when no child', () => {
    tester.componentInstance.situation = {
      spousePresent: true,
      children: []
    };
    tester.detectChanges();

    expect(tester.testElement.textContent).toMatch(/Époux\(se\) présent\(e\)Oui/);
    expect(tester.testElement).not.toContainText('enfant');
  });

  it('should display family situation when empty child present', () => {
    tester.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: null,
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    };
    tester.detectChanges();

    expect(tester.testElement.textContent).toMatch(/Époux\(se\) présent\(e\)Non/);
    expect(tester.testElement).toContainText('1 enfant(s)');
    expect(tester.listItems[0]).toContainText('aucune information');
  });

  it('should display child with only first name', () => {
    tester.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: 'John',
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    };
    tester.detectChanges();

    expect(tester.listItems[0]).toContainText('John');
  });

  it('should display child with only birth date', () => {
    tester.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: null,
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    };
    tester.detectChanges();

    expect(tester.listItems[0].textContent.trim()).toMatch(/30 nov\. 2000\s+–\s+17 ans/);
  });

  it('should display child with first name and birth date', () => {
    tester.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    };
    tester.detectChanges();

    expect(tester.listItems[0].textContent.trim()).toMatch(/John\s+–\s+30 nov\. 2000\s+–\s+17 ans/);
  });
});

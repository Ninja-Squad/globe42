import { async, TestBed } from '@angular/core/testing';
import { Component, LOCALE_ID } from '@angular/core';
import { SituationComponent } from './situation.component';
import { Situation } from '../person-family.component';
import { DateTime } from 'luxon';

@Component({
  template: `
    <gl-situation [situation]="situation"></gl-situation>
  `
})
class TestComponent {
  situation: Situation;
}

describe('SituationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SituationComponent, TestComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
    });

    jasmine.clock().mockDate(DateTime.fromISO('2018-05-01').toJSDate());
  }));

  afterEach(() => jasmine.clock().uninstall());

  it('should display family situation when no child', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.situation = {
      spousePresent: true,
      children: []
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toMatch(/Époux\(se\) présent\(e\)Oui/);
    expect(fixture.nativeElement.textContent).not.toContain('enfant');
  });

  it('should display family situation when empty child present', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: null,
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toMatch(/Époux\(se\) présent\(e\)Non/);
    expect(fixture.nativeElement.textContent).toContain('1 enfant(s)');
    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toBe('aucune information');
  });

  it('should display child with only first name', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: 'John',
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toBe('John');
  });

  it('should display child with only birth date', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: null,
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toMatch(
      /30 nov\. 2000\s+\–\s+17 ans/
    );
  });

  it('should display child with first name and birth date', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toMatch(
      /John\s+\–\s+30 nov\. 2000\s+\–\s+17 ans/
    );
  });
});

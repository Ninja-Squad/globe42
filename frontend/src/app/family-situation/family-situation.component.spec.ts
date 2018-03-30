import { async, TestBed } from '@angular/core/testing';

import { FamilySituationComponent } from './family-situation.component';
import { FamilySituation } from '../models/person.model';
import { Component } from '@angular/core';

describe('FamilySituationComponent', () => {
  const situation: FamilySituation = {
    parentsPresent: false,
    spousePresent: true,
    childCount: 1
  };

  @Component({
    template: '<gl-family-situation [situation]="situation"></gl-family-situation>'
  })
  class TestComponent {
    situation = situation;
  }

  beforeEach(async(() => TestBed.configureTestingModule({
    declarations: [TestComponent, FamilySituationComponent]
  })));

  it('should display a family situation', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Non');
    expect(text).toContain('Oui');
    expect(text).toContain('1');
  });
});

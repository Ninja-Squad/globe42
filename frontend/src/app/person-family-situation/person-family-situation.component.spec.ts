import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFamilySituationComponent } from './person-family-situation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FamilySituationComponent } from '../family-situation/family-situation.component';
import { PersonModel } from '../models/person.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('PersonFamilySituationComponent', () => {
  const person = {
    frenchFamilySituation: {parentsPresent: true},
    abroadFamilySituation: {spousePresent: true}
  } as PersonModel;

  const activatedRoute = {
    parent: {
      snapshot: {
        data: {person}
      }

    }
  };

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [PersonFamilySituationComponent, FamilySituationComponent],
    providers: [
      { provide: ActivatedRoute, useValue: activatedRoute }
    ]
  })));

  it('should display two family situations', () => {
    const fixture = TestBed.createComponent(PersonFamilySituationComponent);
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('h3');
    expect(titles.length).toBe(2);
    expect(titles[0].textContent).toBe('En France');
    expect(titles[1].textContent).toBe('Au pays');

    const situations = fixture.debugElement.queryAll(By.directive(FamilySituationComponent));
    // I don't get why toBe(...) doesn't pass.
    expect(situations[0].componentInstance.situation).toEqual(person.frenchFamilySituation);
    expect(situations[1].componentInstance.situation).toEqual(person.abroadFamilySituation);
  });
});

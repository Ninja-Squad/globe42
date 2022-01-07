import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SituationComponent } from './situation.component';
import { Situation } from '../person-family.component';
import { ComponentTester } from 'ngx-speculoos';
import { RelativeComponent } from '../relative/relative.component';

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

  get childrenItems() {
    return this.elements('.children li');
  }

  get brothersItems() {
    return this.elements('.brothers li');
  }

  get sistersItems() {
    return this.elements('.sisters li');
  }
}

describe('SituationComponent', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationComponent, TestComponent, RelativeComponent]
    });

    tester = new TestComponentTester();
  });

  it('should display family situation when no relative', () => {
    tester.componentInstance.situation = {
      spousePresent: true,
      children: [],
      brothers: [],
      sisters: []
    };
    tester.detectChanges();

    expect(tester.testElement.textContent).toMatch(/Époux\(se\) présent\(e\)Oui/);
    expect(tester.testElement).not.toContainText('enfant');
    expect(tester.childrenItems.length).toBe(0);
    expect(tester.testElement).not.toContainText('frère');
    expect(tester.brothersItems.length).toBe(0);
    expect(tester.testElement).not.toContainText('soeur');
    expect(tester.sistersItems.length).toBe(0);
  });

  it('should display family situation when relatives', () => {
    tester.componentInstance.situation = {
      spousePresent: false,
      children: [
        {
          type: 'CHILD',
          firstName: 'c1',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'CHILD',
          firstName: 'c2',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'CHILD',
          firstName: 'c3',
          birthDate: null,
          location: 'ABROAD'
        }
      ],
      brothers: [
        {
          type: 'BROTHER',
          firstName: 'b1',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'BROTHER',
          firstName: 'b2',
          birthDate: null,
          location: 'ABROAD'
        }
      ],
      sisters: [
        {
          type: 'CHILD',
          firstName: 's1',
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    };
    tester.detectChanges();

    expect(tester.testElement.textContent).toMatch(/Époux\(se\) présent\(e\)Non/);
    expect(tester.testElement).toContainText('3 enfant(s)');
    expect(tester.childrenItems.length).toBe(3);
    expect(tester.testElement).toContainText('2 frère(s)');
    expect(tester.brothersItems.length).toBe(2);
    expect(tester.testElement).toContainText('1 soeur(s)');
    expect(tester.sistersItems.length).toBe(1);
  });
});

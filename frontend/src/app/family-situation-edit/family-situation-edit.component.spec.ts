import { async, TestBed } from '@angular/core/testing';

import { FamilySituationEditComponent } from './family-situation-edit.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('FamilySituationEditComponent', () => {
  @Component({
    template: '<gl-family-situation-edit [situation]="situation" location="french"></gl-family-situation-edit>'
  })
  class TestComponent {

    situation: FormGroup;

    constructor(fb: FormBuilder) {
      this.situation = fb.group({
        parentsPresent: [true],
        spousePresent: [false],
        childCount: []
      });
    }
  }

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    declarations: [TestComponent, FamilySituationEditComponent]
  })));

  it('should display two checkboxes and one number field', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);

    const numbers = fixture.nativeElement.querySelectorAll('input[type="number"]');
    expect(numbers.length).toBe(1);
    expect(numbers[0].value).toBe('');
  });

  it('should change the values in the form group', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes[0].checked = false;
    checkboxes[0].dispatchEvent(new Event('change'));
    checkboxes[1].checked = true;
    checkboxes[1].dispatchEvent(new Event('change'));

    const numbers = fixture.nativeElement.querySelectorAll('input[type="number"]');
    numbers[0].value = '2';
    numbers[0].dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(fixture.componentInstance.situation.value).toEqual({
      parentsPresent: false,
      spousePresent: true,
      childCount: 2
    });
  });
});

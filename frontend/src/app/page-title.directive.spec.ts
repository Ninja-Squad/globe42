import { PageTitleDirective } from './page-title.directive';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'gl-test1',
  template: '<gl-page-title [title]="title"></gl-page-title>'
})
class Test1Component {
  title = 'hello';
}

@Component({
  selector: 'gl-test2',
  template: '<gl-page-title [title]="title"></gl-page-title>'
})
class Test2Component {
  title = 'world';
}

@Component({
  selector: 'gl-test',
  template: `
    <gl-test1 *ngIf="page === 1"></gl-test1>
    <gl-test2 *ngIf="page === 2"></gl-test2>
  `
})
class TestComponent {
  page = 1;
}

describe('PageTitleDirective', () => {

  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        Test1Component,
        Test2Component,
        TestComponent,
        PageTitleDirective
      ]
    });

    titleService = TestBed.inject(Title);
  });

  it('should set the page title', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Globe42 - hello');
  });

  it('should reset the page title to default when it disappears', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.componentInstance.page = 3;
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Globe42');
  });

  it('should change the page title when the page changes', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.componentInstance.page = 2;
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Globe42 - world');
  });
});

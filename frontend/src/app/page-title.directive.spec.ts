import { PageTitleDirective } from './page-title.directive';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { ComponentTester } from 'ngx-speculoos';

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

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }
}

describe('PageTitleDirective', () => {
  let titleService: Title;
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Test1Component, Test2Component, TestComponent, PageTitleDirective]
    });

    titleService = TestBed.inject(Title);
    tester = new TestComponentTester();
    tester.detectChanges();
  });

  it('should set the page title', () => {
    expect(titleService.getTitle()).toBe('Globe42 - hello');
  });

  it('should reset the page title to default when it disappears', () => {
    tester.componentInstance.page = 3;
    tester.detectChanges();

    expect(titleService.getTitle()).toBe('Globe42');
  });

  it('should change the page title when the page changes', () => {
    tester.componentInstance.page = 2;
    tester.detectChanges();

    expect(titleService.getTitle()).toBe('Globe42 - world');
  });
});

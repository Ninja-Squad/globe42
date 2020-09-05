import { TestBed } from '@angular/core/testing';

import { ConfirmOptions, ConfirmService } from './confirm.service';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { GlobeNgbModule } from './globe-ngb/globe-ngb.module';
import { ComponentTester } from 'ngx-speculoos';

@Component({
  template: ''
})
class TestComponent {}

class TestComponentTester extends ComponentTester<TestComponent> {
  constructor() {
    super(TestComponent);
  }

  get modalContent() {
    return document.querySelector('.modal-content');
  }

  get modalTitle() {
    return this.modalContent.querySelector('.modal-title');
  }

  get modalBody() {
    return this.modalContent.querySelector('.modal-body');
  }

  get closeButton() {
    return this.modalContent.querySelectorAll('button')[0];
  }

  get yesButton() {
    return this.modalContent.querySelectorAll('button')[1];
  }

  get noButton() {
    return this.modalContent.querySelectorAll('button')[2];
  }
}

describe('ConfirmService and its modal component', () => {
  let tester: TestComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, GlobeNgbModule.forRoot()],
      declarations: [ConfirmModalContentComponent, TestComponent]
    });

    tester = new TestComponentTester();
    tester.detectChanges();
  });

  afterEach(() => {
    if (tester.modalContent) {
      tester.modalContent.parentElement.removeChild(tester.modalContent);
    }
  });

  function confirm(options: ConfirmOptions): Observable<void> {
    const confirmService = TestBed.inject(ConfirmService);
    const result = confirmService.confirm(options);

    tester.detectChanges();
    return result;
  }

  it('should display a modal dialog when confirming', () => {
    confirm({ message: 'Really?' });
    expect(tester.modalContent).toBeTruthy();
    expect(tester.modalTitle.textContent).toBe('Confirmation');
    expect(tester.modalBody.textContent).toContain('Really?');
  });

  it('should honor the title option', () => {
    confirm({ message: 'Really?', title: 'foo' });
    expect(tester.modalTitle.textContent).toBe('foo');
  });

  it('should emit when confirming', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe(() => done());
    expect(tester.yesButton.textContent).toBe('Oui');
    tester.yesButton.click();

    tester.detectChanges();

    expect(tester.modalContent).toBeFalsy();
  });

  it('should error when not confirming and errorOnClose is true', (done: DoneFn) => {
    confirm({ message: 'Really?', errorOnClose: true }).subscribe({ error: () => done() });
    expect(tester.noButton.textContent).toBe('Non');
    tester.noButton.click();

    tester.detectChanges();

    expect(tester.modalContent).toBeFalsy();
  });

  it('should error when closing and errorOnClose is true', (done: DoneFn) => {
    confirm({ message: 'Really?', errorOnClose: true }).subscribe({ error: () => done() });
    expect(tester.closeButton.textContent).toContain('×');
    tester.closeButton.click();

    tester.detectChanges();

    expect(tester.modalContent).toBeFalsy();
  });

  it('should do nothing when not confirming and errorOnClose is not set', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe({
      error: () => fail(),
      complete: () => done()
    });
    expect(tester.noButton.textContent).toBe('Non');
    tester.noButton.click();

    tester.detectChanges();

    expect(tester.modalContent).toBeFalsy();
  });
});

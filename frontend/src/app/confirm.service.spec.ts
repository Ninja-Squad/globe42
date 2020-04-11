import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOptions, ConfirmService } from './confirm.service';
import { Observable } from 'rxjs';
import { Component, NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { GlobeNgbModule } from './globe-ngb/globe-ngb.module';

describe('ConfirmService and its modal component', () => {
  @Component({
    template: ''
  })
  class TestComponent {}

  @NgModule({
    imports: [RouterTestingModule, GlobeNgbModule.forRoot()],
    declarations: [ConfirmModalContentComponent, TestComponent],
    entryComponents: [ConfirmModalContentComponent]
  })
  class TestModule {}

  let modalContent: HTMLElement;
  let fixture: ComponentFixture<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  }));

  afterEach(() => {
    if (modalContent) {
      modalContent.parentElement.removeChild(modalContent);
    }
  });

  function confirm(options: ConfirmOptions): Observable<void> {
    const confirmService = TestBed.inject(ConfirmService);
    const result = confirmService.confirm(options);

    fixture.detectChanges();
    modalContent = document.querySelector('.modal-content');

    return result;
  }

  it('should display a modal dialog when confirming', () => {
    confirm({ message: 'Really?' });
    expect(modalContent).toBeTruthy();
    expect(modalContent.querySelector('.modal-title').textContent).toBe('Confirmation');
    expect(modalContent.querySelector('.modal-body').textContent).toContain('Really?');
  });

  it('should honor the title option', () => {
    confirm({ message: 'Really?', title: 'foo' });
    expect(modalContent.querySelector('.modal-title').textContent).toBe('foo');
  });

  it('should emit when confirming', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe(() => done());
    const yesButton = modalContent.querySelectorAll('button')[1];
    expect(yesButton.textContent).toBe('Oui');
    yesButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });

  it('should error when not confirming and errorOnClose is true', (done: DoneFn) => {
    confirm({ message: 'Really?', errorOnClose: true }).subscribe({ error: () => done() });
    const noButton = modalContent.querySelectorAll('button')[2];
    expect(noButton.textContent).toBe('Non');
    noButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });

  it('should error when closing and errorOnClose is true', (done: DoneFn) => {
    confirm({ message: 'Really?', errorOnClose: true }).subscribe({ error: () => done() });
    const closeButton = modalContent.querySelectorAll('button')[0];
    expect(closeButton.textContent).toContain('×');
    closeButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });

  it('should do nothing when not confirming and errorOnClose is not set', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe({
      error: () => fail(),
      complete: () => done()
    });
    const noButton = modalContent.querySelectorAll('button')[2];
    expect(noButton.textContent).toBe('Non');
    noButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });
});

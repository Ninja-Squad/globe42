import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOptions, ConfirmService } from './confirm.service';
import { AppModule } from './app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Observable } from 'rxjs/Observable';

describe('ConfirmService and its modal compoent', () => {
  let modalContent;
  let fixture: ComponentFixture<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule, RouterTestingModule ]
    });

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  }));

  afterEach(() => {
    if (modalContent) {
      modalContent.parentElement.removeChild(modalContent);
    }
  });

  function confirm(options: ConfirmOptions): Observable<void> {
    const confirmService = TestBed.get(ConfirmService);
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

  it('should error when not confirming', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe(null, () => done());
    const noButton = modalContent.querySelectorAll('button')[2];
    expect(noButton.textContent).toBe('Non');
    noButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });

  it('should error when closing', (done: DoneFn) => {
    confirm({ message: 'Really?' }).subscribe(null, () => done());
    const closeButton = modalContent.querySelectorAll('button')[0];
    expect(closeButton.textContent).toContain('×');
    closeButton.click();

    fixture.detectChanges();

    expect(document.querySelector('.modal-content')).toBeFalsy();
  });
});

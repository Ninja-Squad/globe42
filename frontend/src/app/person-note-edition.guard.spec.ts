import { TestBed } from '@angular/core/testing';

import { PersonNoteEditionGuard } from './person-note-edition.guard';
import { PersonComponent } from './person/person.component';
import { ConfirmService } from './confirm.service';
import { Observable, of, throwError } from 'rxjs';

describe('PersonNoteEditionGuard', () => {
  let guard: PersonNoteEditionGuard;
  let component: PersonComponent;
  let confirmService: ConfirmService;

  beforeEach(() => {
    confirmService = jasmine.createSpyObj('confirmService', ['confirm']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfirmService, useValue: confirmService }
      ]
    });

    guard = TestBed.get(PersonNoteEditionGuard);
    component = {
      noteEdited : false
    } as PersonComponent;
  });

  it('should allow deactivation if no note edited', () => {
    component.noteEdited = false;
    expect(guard.canDeactivate(component)).toBe(true);
    expect(confirmService.confirm).not.toHaveBeenCalled();
  });

  it('should allow deactivation if note edited and confirmed', () => {
    component.noteEdited = true;
    (confirmService.confirm as jasmine.Spy).and.returnValue(of(undefined));

    let result: boolean = null;
    (guard.canDeactivate(component) as Observable<boolean>).subscribe(r => result = r);

    expect(result).toBe(true);
    expect(confirmService.confirm).toHaveBeenCalled();
  });

  it('should prevent deactivation if note edited and not confirmed', () => {
    component.noteEdited = true;
    (confirmService.confirm as jasmine.Spy).and.returnValue(throwError(undefined));

    let result: boolean = null;
    (guard.canDeactivate(component) as Observable<boolean>).subscribe(r => result = r);

    expect(result).toBe(false);
    expect(confirmService.confirm).toHaveBeenCalled();
  });
});

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PersonComponent } from './person/person.component';
import { ConfirmService } from './confirm.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PersonNoteEditionGuard implements CanDeactivate<PersonComponent> {

  constructor(private confirmService: ConfirmService) {}

  canDeactivate(component: PersonComponent): Observable<boolean> | boolean {
    if (!component.noteEdited) {
      return true;
    }

    return this.confirmService.confirm({
      message: `Vous avez une note en cours d'édition. Voulez-vous vraiment quitter la page\u00a0?`
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}

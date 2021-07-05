import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { catchError, EMPTY, from, Observable, throwError } from 'rxjs';

export interface ConfirmOptions {
  message: string;
  title?: string;
  errorOnClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(private modalService: NgbModal) {}

  confirm(options: ConfirmOptions): Observable<void> {
    const modalRef = this.modalService.open(ConfirmModalContentComponent);
    modalRef.componentInstance.title = options.title ?? 'Confirmation';
    modalRef.componentInstance.message = options.message;
    return from(modalRef.result).pipe(
      catchError(err => (options.errorOnClose ? throwError(err ?? 'not confirmed') : EMPTY))
    );
  }
}

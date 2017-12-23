import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

export interface ConfirmOptions {
  message: string;
  title?: string;
}

@Injectable()
export class ConfirmService {

  constructor(private modalService: NgbModal) { }

  confirm(options: ConfirmOptions): Observable<void> {
    const modalRef = this.modalService.open(ConfirmModalContentComponent);
    modalRef.componentInstance.title = options.title || 'Confirmation';
    modalRef.componentInstance.message = options.message;
    return Observable.from(modalRef.result);
  }
}

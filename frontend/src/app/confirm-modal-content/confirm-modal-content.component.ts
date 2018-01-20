import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'gl-confirm-modal-content',
  templateUrl: './confirm-modal-content.component.html',
  styleUrls: ['./confirm-modal-content.component.scss']
})
export class ConfirmModalContentComponent {

  @Input() message: string;
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal) {}
}

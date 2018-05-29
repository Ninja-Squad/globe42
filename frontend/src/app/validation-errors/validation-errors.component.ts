/* tslint:disable:use-host-property-decorator */
import { Component, HostBinding, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

@Component({
  selector: 'gl-validation-errors',
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
  host: {
    'class': 'invalid-feedback'
  }
})
export class ValidationErrorsComponent implements OnInit {

  @Input()
  control: AbstractControl;

  constructor(@Optional() private controlContainer: ControlContainer) { }

  ngOnInit() {
  }

  @HostBinding('class.d-block') get shouldDisplayErrors() {
    return this.control
      && this.control.invalid
      && (this.control.touched || (this.controlContainer && (this.controlContainer as any).submitted));
  }

  @HostBinding('class.d-none') get shouldNotDisplayErrors() {
    return !this.shouldDisplayErrors;
  }
}

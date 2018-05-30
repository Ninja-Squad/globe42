/* tslint:disable:use-host-property-decorator */
/* tslint:disable:no-input-rename */
import {
  Component,
  ContentChildren,
  Directive,
  HostBinding,
  Input,
  OnInit,
  Optional,
  QueryList,
  TemplateRef
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

@Directive({selector: 'ng-template[glError]'})
export class ValidationErrorDirective {
  @Input('glError') type: string;

  constructor(public templateRef: TemplateRef<any>) { }
}

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

  @ContentChildren(ValidationErrorDirective)
  errorDirectives: QueryList<ValidationErrorDirective>;

  constructor(@Optional() private controlContainer: ControlContainer) {
  }

  ngOnInit() {
  }

  @HostBinding('class.d-block')
  get shouldDisplayErrors() {
    return this.control
      && this.control.invalid
      && (this.control.touched || (this.controlContainer && (this.controlContainer as any).submitted));
  }

  @HostBinding('class.d-none')
  get shouldNotDisplayErrors() {
    return !this.shouldDisplayErrors;
  }
}

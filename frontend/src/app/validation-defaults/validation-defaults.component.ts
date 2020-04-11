import { Component } from '@angular/core';
import { ValdemortConfig } from 'ngx-valdemort';

@Component({
  selector: 'gl-validation-defaults',
  templateUrl: './validation-defaults.component.html'
})
export class ValidationDefaultsComponent {
  constructor(config: ValdemortConfig) {
    config.errorsClasses = 'invalid-feedback';
  }
}

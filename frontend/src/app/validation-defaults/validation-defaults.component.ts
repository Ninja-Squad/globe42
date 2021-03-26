import { Component } from '@angular/core';
import { ValdemortConfig } from 'ngx-valdemort';
import { environment } from '../../environments/environment';

@Component({
  selector: 'gl-validation-defaults',
  templateUrl: './validation-defaults.component.html'
})
export class ValidationDefaultsComponent {
  constructor(config: ValdemortConfig) {
    config.errorsClasses = 'invalid-feedback';
    config.shouldThrowOnMissingControl = () => !environment.production;
  }
}

import { NgModule } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { GlobeNgbModule } from './globe-ngb.module';

/**
 * A module for unit tests, which imports the root GlobeNgbModule and disables
 * animations
 */
@NgModule({
  imports: [GlobeNgbModule.forRoot()],
  exports: [GlobeNgbModule]
})
export class GlobeNgbTestingModule {
  constructor(ngbConfig: NgbConfig) {
    ngbConfig.animation = false;
  }
}

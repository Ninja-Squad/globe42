/* tslint:disable:no-use-before-declare */

import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateStringAdapterService } from './date-string-adapter.service';
import { FrenchDateParserFormatterService } from './french-date-parser-formatter.service';
import { NonEditableTypeaheadDirective } from './non-editable-typeahead.directive';
import { DatepickerContainerComponent } from './datepicker-container.component';

@Injectable()
export class GlobeNgbDatepickerConfig extends NgbDatepickerConfig {
  constructor() {
    super();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: 2099, month: 12, day: 31 };
  }
}

@NgModule({
  imports: [
    NgbModule
  ],
  exports: [
    NgbModule,
    NonEditableTypeaheadDirective,
    DatepickerContainerComponent
  ],
  declarations: [NonEditableTypeaheadDirective, DatepickerContainerComponent]
})
export class GlobeNgbModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobeNgbRootModule,
      providers: []
    };
  }
}

@NgModule({
  imports: [NgbModule.forRoot(), GlobeNgbModule],
  exports: [GlobeNgbModule],
  providers: [
    { provide: NgbDateParserFormatter, useClass: FrenchDateParserFormatterService },
    { provide: NgbDateAdapter, useClass: DateStringAdapterService },
    { provide: NgbDatepickerConfig, useClass: GlobeNgbDatepickerConfig }
  ]
})
export class GlobeNgbRootModule {}


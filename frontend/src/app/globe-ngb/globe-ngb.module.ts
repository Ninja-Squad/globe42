import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDatepickerI18n,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import { DateStringAdapterService } from './date-string-adapter.service';
import { FrenchDateParserFormatterService } from './french-date-parser-formatter.service';
import { FrenchDatepickerI18nService } from './french-datepicker-i18n.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

const DATEPICKER_CONFIG = {
  minDate: { year: 1900, month: 1, day: 1 },
  maxDate: { year: 2099, month: 12, day: 31 }
} as NgbDatepickerConfig;

@NgModule({
  imports: [
    NgbModule
  ],
  exports: [
    NgbModule
  ]
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
    { provide: NgbDatepickerI18n, useClass: FrenchDatepickerI18nService },
    { provide: NgbDateParserFormatter, useClass: FrenchDateParserFormatterService },
    { provide: NgbDateAdapter, useClass: DateStringAdapterService },
    { provide: NgbDatepickerConfig, useValue: DATEPICKER_CONFIG }
  ]
})
export class GlobeNgbRootModule {}


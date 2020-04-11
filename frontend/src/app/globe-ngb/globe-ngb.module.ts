import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import {
  NgbAlertModule,
  NgbButtonsModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
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

const NGB_MODULES = [
  NgbModalModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbAlertModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
  NgbButtonsModule,
  NgbPaginationModule,
  NgbProgressbarModule
];

@NgModule({
  imports: NGB_MODULES,
  exports: [...NGB_MODULES, NonEditableTypeaheadDirective, DatepickerContainerComponent],
  declarations: [NonEditableTypeaheadDirective, DatepickerContainerComponent]
})
export class GlobeNgbModule {
  static forRoot(): ModuleWithProviders<GlobeNgbModule> {
    return {
      ngModule: GlobeNgbModule,
      providers: [
        { provide: NgbDateParserFormatter, useClass: FrenchDateParserFormatterService },
        { provide: NgbDateAdapter, useClass: DateStringAdapterService },
        { provide: NgbDatepickerConfig, useClass: GlobeNgbDatepickerConfig }
      ]
    };
  }
}

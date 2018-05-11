import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { PersonsComponent } from './persons/persons.component';
import { PersonComponent } from './person/person.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { DisplayCityPipe } from './display-city.pipe';
import { DisplayGenderPipe } from './display-gender.pipe';
import { LoginComponent } from './login/login.component';
import { IncomeTypesComponent } from './income-types/income-types.component';
import { IncomeTypeEditComponent } from './income-type-edit/income-type-edit.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { DisplayMaritalStatusPipe } from './display-marital-status.pipe';
import { IncomeSourcesComponent } from './income-sources/income-sources.component';
import { IncomeSourceEditComponent } from './income-source-edit/income-source-edit.component';
import { PersonLayoutComponent } from './person-layout/person-layout.component';
import { PersonResourcesComponent } from './person-resources/person-resources.component';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { PersonIncomeEditComponent } from './person-income-edit/person-income-edit.component';
import { ErrorService } from './error.service';
import { ErrorComponent } from './error/error.component';
import { FullnamePipe } from './fullname.pipe';
import { DisplayFiscalStatusPipe } from './display-fiscal-status.pipe';
import { PersonFamilySituationComponent } from './person-family-situation/person-family-situation.component';
import { FamilySituationComponent } from './family-situation/family-situation.component';
import { DisplayHousingPipe } from './display-housing.pipe';
import { DisplayHealthCareCoveragePipe } from './display-health-care-coverage.pipe';
import { DisplayHealthInsurancePipe } from './display-health-insurance.pipe';
import { FamilySituationEditComponent } from './family-situation-edit/family-situation-edit.component';
import { CitiesUploadComponent } from './cities-upload/cities-upload.component';
import { TasksComponent } from './tasks/tasks.component';
import { TasksLayoutComponent } from './tasks-layout/tasks-layout.component';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { NoteComponent } from './note/note.component';
import { PersonNotesComponent } from './person-notes/person-notes.component';
import { PersonFilesComponent } from './person-files/person-files.component';
import { FileSizePipe } from './file-size.pipe';
import { ChargeCategoriesComponent } from './charge-categories/charge-categories.component';
import { ChargeCategoryEditComponent } from './charge-category-edit/charge-category-edit.component';
import { ChargeTypesComponent } from './charge-types/charge-types.component';
import { ChargeTypeEditComponent } from './charge-type-edit/charge-type-edit.component';
import { PersonChargeEditComponent } from './person-charge-edit/person-charge-edit.component';
import { PersonParticipationsComponent } from './person-participations/person-participations.component';
import { DisplayActivityTypePipe } from './display-activity-type.pipe';
import { ActivityTypesComponent } from './activity-types/activity-types.component';
import { ParticipantsComponent } from './participants/participants.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MinValidatorDirective } from './min-validator.directive';
import { MaxValidatorDirective } from './max-validator.directive';
import { Settings } from 'luxon';
import { DurationPipe } from './duration.pipe';
import { SpentTimesComponent } from './spent-times/spent-times.component';
import { SpentTimeAddComponent } from './spent-time-add/spent-time-add.component';
import { PersonsLayoutComponent } from './persons-layout/persons-layout.component';
import { CurrentUserModule } from './current-user/current-user.module';
import { GlobeNgbModule } from './globe-ngb/globe-ngb.module';
import { SpentTimeStatisticsComponent } from './spent-time-statistics/spent-time-statistics.component';
import { ChartComponent } from './chart/chart.component';
import { PersonTasksComponent } from './person-tasks/person-tasks.component';
import { PersonWeddingEventsComponent } from './person-wedding-events/person-wedding-events.component';
import { DisplayWeddingEventTypePipe } from './display-wedding-event-type.pipe';
// tslint:disable-next-line:max-line-length
import { PersonPerUnitRevenueInformationEditComponent } from './person-per-unit-revenue-information-edit/person-per-unit-revenue-information-edit.component';
import { PersonMembershipsComponent } from './person-memberships/person-memberships.component';
import { DisplayPaymentModePipe } from './display-payment-mode.pipe';
import { PersonMembershipPrintComponent } from './person-membership-print/person-membership-print.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    PersonsComponent,
    PersonComponent,
    PersonEditComponent,
    LoginComponent,
    FormControlValidationDirective,
    DisplayCityPipe,
    DisplayGenderPipe,
    IncomeTypesComponent,
    IncomeTypeEditComponent,
    PasswordChangeComponent,
    UsersComponent,
    UserEditComponent,
    PasswordResetComponent,
    DisplayMaritalStatusPipe,
    IncomeSourcesComponent,
    IncomeSourceEditComponent,
    PersonResourcesComponent,
    PersonLayoutComponent,
    ConfirmModalContentComponent,
    PersonIncomeEditComponent,
    ErrorComponent,
    FullnamePipe,
    DisplayFiscalStatusPipe,
    DisplayHealthCareCoveragePipe,
    DisplayHealthInsurancePipe,
    PersonFamilySituationComponent,
    FamilySituationComponent,
    DisplayHousingPipe,
    FamilySituationEditComponent,
    CitiesUploadComponent,
    TasksComponent,
    TasksLayoutComponent,
    TasksPageComponent,
    TaskEditComponent,
    NoteComponent,
    PersonNotesComponent,
    PersonFilesComponent,
    FileSizePipe,
    PersonNotesComponent,
    ChargeCategoriesComponent,
    ChargeCategoryEditComponent,
    ChargeTypesComponent,
    ChargeTypeEditComponent,
    PersonChargeEditComponent,
    PersonParticipationsComponent,
    DisplayActivityTypePipe,
    ActivityTypesComponent,
    ParticipantsComponent,
    MinValidatorDirective,
    MaxValidatorDirective,
    DurationPipe,
    SpentTimesComponent,
    SpentTimeAddComponent,
    PersonsLayoutComponent,
    SpentTimeStatisticsComponent,
    ChartComponent,
    PersonTasksComponent,
    PersonWeddingEventsComponent,
    DisplayWeddingEventTypePipe,
    PersonPerUnitRevenueInformationEditComponent,
    PersonMembershipsComponent,
    DisplayPaymentModePipe,
    PersonMembershipPrintComponent
  ],
  entryComponents: [
    ConfirmModalContentComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    GlobeNgbModule.forRoot(),
    CurrentUserModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: ErrorService,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Settings.defaultLocale = 'fr';
    Settings.defaultZoneName = 'Europe/Paris';
  }
}

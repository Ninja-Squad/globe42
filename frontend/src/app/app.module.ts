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
import { PersonService } from './person.service';
import { PersonComponent } from './person/person.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonResolverService } from './person-resolver.service';
import { PersonsResolverService } from './persons-resolver.service';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { SearchCityService } from './search-city.service';
import { DisplayCityPipe } from './display-city.pipe';
import { DisplayGenderPipe } from './display-gender.pipe';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { IncomeTypesComponent } from './income-types/income-types.component';
import { IncomeTypesResolverService } from './income-types-resolver.service';
import { IncomeTypeEditComponent } from './income-type-edit/income-type-edit.component';
import { IncomeTypeResolverService } from './income-type-resolver.service';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UsersComponent } from './users/users.component';
import { UsersResolverService } from './users-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserResolverService } from './user-resolver.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { DisplayMaritalStatusPipe } from './display-marital-status.pipe';
import { IncomeSourcesComponent } from './income-sources/income-sources.component';
import { IncomeSourcesResolverService } from './income-sources-resolver.service';
import { IncomeSourceEditComponent } from './income-source-edit/income-source-edit.component';
import { IncomeSourceResolverService } from './income-source-resolver.service';
import { IncomeSourceService } from './income-source.service';
import { IncomeSourceTypeService } from './income-source-type.service';
import { IncomesResolverService } from './incomes-resolver.service';
import { PersonLayoutComponent } from './person-layout/person-layout.component';
import { IncomeService } from './income.service';
import { PersonResourcesComponent } from './person-resources/person-resources.component';
import { ConfirmModalContentComponent } from './confirm-modal-content/confirm-modal-content.component';
import { ConfirmService } from './confirm.service';
import { PersonIncomeEditComponent } from './person-income-edit/person-income-edit.component';
import { ErrorService } from './error.service';
import { ErrorComponent } from './error/error.component';
import { FullnamePipe } from './fullname.pipe';
import { DisplayFiscalStatusPipe } from './display-fiscal-status.pipe';
import { PersonFamilySituationComponent } from './person-family-situation/person-family-situation.component';
import { FamilySituationComponent } from './family-situation/family-situation.component';
import { DisplayHousingPipe } from './display-housing.pipe';
import { DisplayHealthCareCoveragePipe } from './display-health-care-coverage.pipe';
import { FamilySituationEditComponent } from './family-situation-edit/family-situation-edit.component';
import { CitiesUploadComponent } from './cities-upload/cities-upload.component';
import { TasksComponent } from './tasks/tasks.component';
import { TasksLayoutComponent } from './tasks-layout/tasks-layout.component';
import { TasksResolverService } from './tasks-resolver.service';
import { TaskService } from './task.service';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskResolverService } from './task-resolver.service';
import { NoteComponent } from './note/note.component';
import { PersonNoteService } from './person-note.service';
import { PersonNotesComponent } from './person-notes/person-notes.component';
import { PersonFilesComponent } from './person-files/person-files.component';
import { PersonFileService } from './person-file.service';
import { FileSizePipe } from './file-size.pipe';
import { ChargeCategoriesComponent } from './charge-categories/charge-categories.component';
import { ChargeCategoryService } from './charge-category.service';
import { ChargeCategoryResolverService } from './charge-category-resolver.service';
import { ChargeCategoriesResolverService } from './charge-categories-resolver.service';
import { ChargeCategoryEditComponent } from './charge-category-edit/charge-category-edit.component';
import { ChargeTypesComponent } from './charge-types/charge-types.component';
import { ChargeTypeService } from './charge-type.service';
import { ChargeTypesResolverService } from './charge-types-resolver.service';
import { ChargeTypeEditComponent } from './charge-type-edit/charge-type-edit.component';
import { ChargeTypeResolverService } from './charge-type-resolver.service';
import { ChargeService } from './charge.service';
import { ChargesResolverService } from './charges-resolver.service';
import { PersonChargeEditComponent } from './person-charge-edit/person-charge-edit.component';
import { PersonParticipationsComponent } from './person-participations/person-participations.component';
import { ParticipationsResolverService } from './participations-resolver.service';
import { ParticipationService } from './participation.service';
import { DisplayActivityTypePipe } from './display-activity-type.pipe';
import { ActivityTypesComponent } from './activity-types/activity-types.component';
import { ParticipantsComponent } from './participants/participants.component';
import { ParticipantsResolverService } from './participants-resolver.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MinValidatorDirective } from './min-validator.directive';
import { MaxValidatorDirective } from './max-validator.directive';
import { Settings } from 'luxon';
import { DurationPipe } from './duration.pipe';
import { SpentTimesComponent } from './spent-times/spent-times.component';
import { SpentTimeAddComponent } from './spent-time-add/spent-time-add.component';
import { PersonsLayoutComponent } from './persons-layout/persons-layout.component';
import { TaskCategoriesResolverService } from './task-categories-resolver.service';
import { CurrentUserModule } from './current-user/current-user.module';
import { GlobeNgbModule } from './globe-ngb/globe-ngb.module';
import { SpentTimeStatisticsComponent } from './spent-time-statistics/spent-time-statistics.component';
import { ChartComponent } from './chart/chart.component';
import { PersonNoteEditionGuard } from './person-note-edition.guard';
import { PersonTasksComponent } from './person-tasks/person-tasks.component';
import { CountryService } from './country.service';
import { CountriesResolverService } from './countries-resolver.service';
import { PersonWeddingEventsComponent } from './person-wedding-events/person-wedding-events.component';
import { WeddingEventsResolverService } from './wedding-events-resolver.service';
import { DisplayWeddingEventTypePipe } from './display-wedding-event-type.pipe';
import { WeddingEventService } from './wedding-event.service';

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
    DisplayWeddingEventTypePipe
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
    PersonService,
    UserService,
    SearchCityService,
    DisplayCityPipe,
    PersonResolverService,
    PersonNoteEditionGuard,
    PersonsResolverService,
    IncomeTypesResolverService,
    IncomeSourceTypeService,
    IncomeSourceService,
    IncomeTypeResolverService,
    IncomeSourcesResolverService,
    IncomeSourceResolverService,
    ChargeCategoryService,
    ChargeCategoryResolverService,
    ChargeCategoriesResolverService,
    ChargeTypeService,
    ChargeTypesResolverService,
    ChargeTypeResolverService,
    UsersResolverService,
    IncomeService,
    IncomesResolverService,
    ChargeService,
    ChargesResolverService,
    UserResolverService,
    ErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: ErrorService,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    ConfirmService,
    FullnamePipe,
    TasksResolverService,
    TaskService,
    TaskResolverService,
    PersonNoteService,
    PersonFileService,
    ParticipationService,
    ParticipationsResolverService,
    ParticipantsResolverService,
    TaskCategoriesResolverService,
    CountryService,
    CountriesResolverService,
    WeddingEventService,
    WeddingEventsResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Settings.defaultLocale = 'fr';
    Settings.defaultZoneName = 'Europe/Paris';
  }
}

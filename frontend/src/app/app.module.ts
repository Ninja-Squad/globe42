import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { FrenchDatepickerI18nService } from './french-datepicker-i18n.service';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { SearchCityService } from './search-city.service';
import { DisplayCityPipe } from './display-city.pipe';
import { DisplayGenderPipe } from './display-gender.pipe';
import { LoginComponent } from './login/login.component';
import { UserService } from 'app/user.service';
import { AuthenticatedGuard } from 'app/authenticated.guard';
import { IncomeTypesComponent } from './income-types/income-types.component';
import { IncomeTypesResolverService } from 'app/income-types-resolver.service';
import { IncomeTypeEditComponent } from './income-type-edit/income-type-edit.component';
import { IncomeTypeResolverService } from 'app/income-type-resolver.service';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UsersComponent } from './users/users.component';
import { UsersResolverService } from './users-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserResolverService } from './user-resolver.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { JwtInterceptorService } from './jwt-interceptor.service';
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
import { PersonIncomesComponent } from './person-incomes/person-incomes.component';
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
import { DisplayHealthCareCoveragePipe } from './display-health-care-coverage.pipe'
import { FamilySituationEditComponent } from './family-situation-edit/family-situation-edit.component';
import { CitiesUploadComponent } from './cities-upload/cities-upload.component';
import { TasksComponent } from './tasks/tasks.component';
import { TasksLayoutComponent } from './tasks-layout/tasks-layout.component';
import { TasksResolverService } from './tasks-resolver.service';
import { TaskService } from './task.service';
import * as moment from 'moment';
import { NowService } from './now.service';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskResolverService } from './task-resolver.service';
import { NoteComponent } from './note/note.component';
import { PersonNoteService } from './person-note.service';
import { PersonNotesComponent } from './person-notes/person-notes.component';
import { FrenchDateParserFormatterService } from './french-date-parser-formatter.service';
import { PersonFilesComponent } from './person-files/person-files.component';
import { PersonFileService } from './person-file.service';
import { FileSizePipe } from './file-size.pipe';
import { ChargeCategoriesComponent } from './charge-categories/charge-categories.component';
import { ChargeCategoryService } from './charge-category.service';
import { ChargeCategoryResolverService } from './charge-category-resolver.service';
import { ChargeCategoriesResolverService } from './charge-categories-resolver.service';
import { ChargeCategoryEditComponent } from './charge-category-edit/charge-category-edit.component';

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
    PersonIncomesComponent,
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
    ChargeCategoryEditComponent
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
    NgbModule.forRoot()
  ],
  providers: [
    PersonService,
    UserService,
    SearchCityService,
    DisplayCityPipe,
    PersonResolverService,
    PersonsResolverService,
    { provide: NgbDatepickerI18n, useClass: FrenchDatepickerI18nService },
    { provide: NgbDateParserFormatter, useClass: FrenchDateParserFormatterService },
    AuthenticatedGuard,
    IncomeTypesResolverService,
    IncomeSourceTypeService,
    IncomeSourceService,
    IncomeTypeResolverService,
    IncomeSourcesResolverService,
    IncomeSourceResolverService,
    ChargeCategoryService,
    ChargeCategoryResolverService,
    ChargeCategoriesResolverService,
    UsersResolverService,
    IncomeService,
    IncomesResolverService,
    UserResolverService,
    JwtInterceptorService,
    ErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: JwtInterceptorService,
      multi: true
    },
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
    NowService,
    PersonNoteService,
    PersonFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    moment.locale('fr');
  }
}

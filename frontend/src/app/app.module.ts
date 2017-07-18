import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    ConfirmModalContentComponent
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
    AuthenticatedGuard,
    IncomeTypesResolverService,
    IncomeSourceTypeService,
    IncomeSourceService,
    IncomeTypeResolverService,
    IncomeSourcesResolverService,
    IncomeSourceResolverService,
    UsersResolverService,
    IncomeService,
    IncomesResolverService,
    UserResolverService,
    JwtInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: JwtInterceptorService,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    ConfirmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

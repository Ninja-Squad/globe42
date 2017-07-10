import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
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
import { IncomeService } from 'app/income.service';
import { IncomeTypeEditComponent } from './income-type-edit/income-type-edit.component';
import { IncomeTypeResolverService } from 'app/income-type-resolver.service';
import { PasswordChangeComponent } from './password-change/password-change.component';

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
    PasswordChangeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
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
    IncomeService,
    IncomeTypeResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    PersonsComponent,
    PersonComponent,
    PersonEditComponent,
    FormControlValidationDirective,
    DisplayCityPipe,
    DisplayGenderPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot()
  ],
  providers: [
    PersonService,
    SearchCityService,
    DisplayCityPipe,
    PersonResolverService,
    PersonsResolverService,
    { provide: NgbDatepickerI18n, useClass: FrenchDatepickerI18nService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

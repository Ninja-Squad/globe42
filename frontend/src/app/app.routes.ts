import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PersonsComponent } from './persons/persons.component';
import { PersonComponent } from './person/person.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonResolverService } from './person-resolver.service';
import { PersonsResolverService } from './persons-resolver.service';
import { LoginComponent } from './login/login.component';
import { AuthenticatedGuard } from './authenticated.guard';
import { IncomeTypesComponent } from './income-types/income-types.component';
import { IncomeTypesResolverService } from './income-types-resolver.service';
import { IncomeTypeEditComponent } from './income-type-edit/income-type-edit.component';
import { IncomeTypeResolverService } from './income-type-resolver.service';
import { PasswordChangeComponent } from './password-change/password-change.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', canActivate: [AuthenticatedGuard], children: [
      {
        path: 'persons',
        children: [
          {
            path: '',
            component: PersonsComponent,
            resolve: {
              persons: PersonsResolverService
            }
          },
          { path: 'create', component: PersonEditComponent },
          {
            path: ':id',
            component: PersonComponent,
            resolve: {
              person: PersonResolverService
            }
          },
          {
            path: ':id/edit',
            component: PersonEditComponent,
            resolve: {
              person: PersonResolverService
            }
          }
        ]
      },
      {
        path: 'income-types',
        children: [
          {
            path: '',
            component: IncomeTypesComponent,
            resolve: {
              incomeTypes: IncomeTypesResolverService
            }
          },
          {path: 'create', component: IncomeTypeEditComponent},
          {
            path: ':id/edit',
            component: IncomeTypeEditComponent,
            resolve: {
              incomeType: IncomeTypeResolverService
            }
          }
        ]
      },
      { path: 'password-changes', component: PasswordChangeComponent }
    ]
  }
];

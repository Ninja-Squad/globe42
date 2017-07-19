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
import { UsersComponent } from './users/users.component';
import { UsersResolverService } from './users-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserResolverService } from './user-resolver.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { IncomeSourcesComponent } from './income-sources/income-sources.component';
import { IncomeSourcesResolverService } from './income-sources-resolver.service';
import { IncomeSourceEditComponent } from './income-source-edit/income-source-edit.component';
import { IncomeSourceResolverService } from './income-source-resolver.service';
import { IncomesResolverService } from './incomes-resolver.service';
import { PersonLayoutComponent } from './person-layout/person-layout.component';
import { PersonIncomesComponent } from './person-incomes/person-incomes.component';
import { PersonIncomeEditComponent } from './person-income-edit/person-income-edit.component';

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
            component: PersonLayoutComponent,
            resolve: {
              person: PersonResolverService
            },
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'info' },
              { path: 'info', component: PersonComponent },
              {
                path: 'incomes',
                component: PersonIncomesComponent,
                resolve: {
                  incomes: IncomesResolverService
                }
              }
            ]
          },
          {
            path: ':id/edit',
            component: PersonEditComponent,
            resolve: {
              person: PersonResolverService
            }
          },
          {
            path: ':id/incomes/create',
            component: PersonIncomeEditComponent,
            resolve: {
              person: PersonResolverService,
              incomeSources: IncomeSourcesResolverService
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
          { path: 'create', component: IncomeTypeEditComponent },
          {
            path: ':id/edit',
            component: IncomeTypeEditComponent,
            resolve: {
              incomeType: IncomeTypeResolverService
            }
          }
        ]
      },
      {
        path: 'income-sources',
        children: [
          {
            path: '',
            component: IncomeSourcesComponent,
            resolve: {
              incomeSources: IncomeSourcesResolverService
            }
          },
          {
            path: 'create',
            component: IncomeSourceEditComponent,
            resolve: {
              incomeSourceTypes: IncomeTypesResolverService
            }
          },
          {
            path: ':id/edit',
            component: IncomeSourceEditComponent,
            resolve: {
              incomeSource: IncomeSourceResolverService,
              incomeSourceTypes: IncomeTypesResolverService
            }
          }
        ]
      },
      { path: 'password-changes', component: PasswordChangeComponent },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UsersComponent,
            resolve: {
              users: UsersResolverService
            }
          },
          { path: 'create', component: UserEditComponent },
          {
            path: ':id/edit',
            component: UserEditComponent,
            resolve: {
              user: UserResolverService
            }
          },
          {
            path: ':id/password-resets',
            component: PasswordResetComponent,
            resolve: {
              user: UserResolverService
            }
          }
        ]
      }
    ]
  }
];

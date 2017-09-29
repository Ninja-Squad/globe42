import { Route, Routes } from '@angular/router';

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
import { PersonResourcesComponent } from './person-resources/person-resources.component';
import { PersonIncomeEditComponent } from './person-income-edit/person-income-edit.component';
import { PersonFamilySituationComponent } from './person-family-situation/person-family-situation.component';
import { CitiesUploadComponent } from './cities-upload/cities-upload.component';
import { TasksLayoutComponent } from './tasks-layout/tasks-layout.component';
import { TasksResolverService } from './tasks-resolver.service';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskResolverService } from './task-resolver.service';
import { PersonFilesComponent } from './person-files/person-files.component';
import { ChargeCategoriesComponent } from './charge-categories/charge-categories.component';
import { ChargeCategoryResolverService } from './charge-category-resolver.service';
import { ChargeCategoriesResolverService } from './charge-categories-resolver.service';
import { ChargeCategoryEditComponent } from './charge-category-edit/charge-category-edit.component';
import { ChargeTypesComponent } from './charge-types/charge-types.component';
import { ChargeTypesResolverService } from './charge-types-resolver.service';
import { ChargeTypeEditComponent } from './charge-type-edit/charge-type-edit.component';
import { ChargeTypeResolverService } from './charge-type-resolver.service';
import { ChargesResolverService } from './charges-resolver.service';
import { PersonChargeEditComponent } from './person-charge-edit/person-charge-edit.component';
import { ParticipationsResolverService } from './participations-resolver.service';
import { PersonParticipationsComponent } from './person-participations/person-participations.component';
import { ActivityTypesComponent } from './activity-types/activity-types.component';
import { ACTIVITY_TYPE_TRANSLATIONS } from './display-activity-type.pipe';
import { ParticipantsComponent } from './participants/participants.component';
import { ParticipantsResolverService } from './participants-resolver.service';

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
                path: 'resources',
                component: PersonResourcesComponent,
                resolve: {
                  incomes: IncomesResolverService,
                  charges: ChargesResolverService,
                }
              },
              { path: 'family', component: PersonFamilySituationComponent },
              {
                path: 'tasks',
                component: TasksPageComponent,
                data: { taskListType: 'person' },
                resolve: {
                  tasks: TasksResolverService
                },
                runGuardsAndResolvers: 'paramsOrQueryParamsChange'
              },
              { path: 'files', component: PersonFilesComponent },
              {
                path: 'participations',
                component: PersonParticipationsComponent,
                resolve: {
                  participations: ParticipationsResolverService
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
          },
          {
            path: ':id/charges/create',
            component: PersonChargeEditComponent,
            resolve: {
              person: PersonResolverService,
              chargeTypes: ChargeTypesResolverService
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
      {
        path: 'charge-categories',
        children: [
          {
            path: '',
            component: ChargeCategoriesComponent,
            resolve: {
              chargeCategories: ChargeCategoriesResolverService
            }
          },
          { path: 'create', component: ChargeCategoryEditComponent },
          {
            path: ':id/edit',
            component: ChargeCategoryEditComponent,
            resolve: {
              chargeCategory: ChargeCategoryResolverService
            }
          }
        ]
      },
      {
        path: 'charge-types',
        children: [
          {
            path: '',
            component: ChargeTypesComponent,
            resolve: {
              chargeTypes: ChargeTypesResolverService
            }
          },
          {
            path: 'create',
            component: ChargeTypeEditComponent,
            resolve: {
              chargeCategories: ChargeCategoriesResolverService
            }
          },
          {
            path: ':id/edit',
            component: ChargeTypeEditComponent,
            resolve: {
              chargeType: ChargeTypeResolverService,
              chargeCategories: ChargeCategoriesResolverService
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
      },
      {
        path: 'tasks',
        component: TasksLayoutComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'todo' },
          taskRoute('todo'),
          taskRoute('urgent'),
          taskRoute('mine'),
          taskRoute('unassigned'),
          taskRoute('archived'),
        ]
      },
      {
        path: 'tasks/create',
        component: TaskEditComponent,
        resolve: {
          persons: PersonsResolverService,
          users: UsersResolverService
        }
      },
      {
        path: 'tasks/:id/edit',
        component: TaskEditComponent,
        resolve: {
          persons: PersonsResolverService,
          users: UsersResolverService,
          task: TaskResolverService
        }
      },
      {
        path: 'cities',
        component: CitiesUploadComponent
      },
      {
        path: 'activity-types',
        component: ActivityTypesComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: ACTIVITY_TYPE_TRANSLATIONS[0].key },
          {
            path: ':activityType',
            component: ParticipantsComponent,
            resolve: {
              participants: ParticipantsResolverService
            }
          }
        ]
      }
    ]
  }
];

/**
 * Creates a task route of a given type
 * This function has no reason to be exported, other than to make the AOT compiler happy.
 */
export function taskRoute(taskListType: string): Route {
  return {
    path: taskListType,
    component: TasksPageComponent,
    data: { taskListType },
    resolve: {
      tasks: TasksResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  };
}

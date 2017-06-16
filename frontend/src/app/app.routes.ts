import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PersonsComponent } from './persons/persons.component';
import { PersonComponent } from './person/person.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonResolverService } from './person-resolver.service';
import { PersonsResolverService } from './persons-resolver.service';
import { LoginComponent } from 'app/login/login.component';
import { AuthenticatedGuard } from 'app/authenticated.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'persons', children: [
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
  ],
    canActivate: [AuthenticatedGuard]
  }
];

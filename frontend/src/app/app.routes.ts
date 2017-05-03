import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserResolverService } from './user-resolver.service';
import { UsersResolverService } from './users-resolver.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users', children: [
    {
      path: '',
      component: UsersComponent,
      resolve: {
        users: UsersResolverService
      }
    },
    { path: 'create', component: UserEditComponent },
    {
      path: ':id',
      component: UserComponent,
      resolve: {
        user: UserResolverService
      }
    },
    {
      path: ':id/edit',
      component: UserEditComponent,
      resolve: {
        user: UserResolverService
      }
    }
  ]
  }
];

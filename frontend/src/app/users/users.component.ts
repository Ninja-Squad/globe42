import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { sortBy } from '../utils';
import { ConfirmService } from '../confirm.service';
import { UserService } from '../user.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'gl-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: Array<UserModel>;

  constructor(
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private userService: UserService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.users = sortBy<UserModel>(this.route.snapshot.data.users, u => u.login);
  }

  delete(user: UserModel) {
    this.confirmService
      .confirm({ message: `Voulez-vous vraiment supprimer l'utilisateur ${user.login}\u00A0?` })
      .pipe(
        switchMap(() => this.userService.delete(user.id)),
        switchMap(() => this.userService.list())
      )
      .subscribe(users => (this.users = sortBy(users, u => u.login)));
  }

  isCurrentUser(user: UserModel) {
    return this.currentUserService.userEvents.getValue().id === user.id;
  }
}

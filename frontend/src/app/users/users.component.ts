import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { sortBy } from '../utils';
import { ConfirmService } from '../confirm.service';
import { UserService } from '../user.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'gl-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<UserModel>;

  constructor(private route: ActivatedRoute,
              private confirmService: ConfirmService,
              private userService: UserService) { }

  ngOnInit() {
    this.users = sortBy<UserModel>(this.route.snapshot.data['users'], u => u.login);
  }

  delete(user: UserModel) {
    this.confirmService.confirm({message: `Voulez-vous vraiment supprimer l\'utilisateur ${user.login}\u00A0?`})
      .switchMap(() => this.userService.delete(user.id))
      .switchMap(() => this.userService.list())
      .subscribe(users => this.users = sortBy(users, u => u.login), () => {});
  }

  isCurrentUser(user) {
    return this.userService.userEvents.getValue().id === user.id;
  }
}

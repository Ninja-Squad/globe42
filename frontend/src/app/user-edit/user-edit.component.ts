import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserCommand } from '../models/user.command';
import { UserWithPasswordModel } from '../models/user-with-password.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'gl-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  private editedUser: UserModel;
  createdUser: UserWithPasswordModel;

  user: UserCommand;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.editedUser = this.route.snapshot.data['user'];
    this.user = this.editedUser ? {login: this.editedUser.login, admin: this.editedUser.admin} : {
      login: '',
      admin: false
    };
  }

  save() {
    if (this.editedUser) {
      this.userService.update(this.editedUser.id, this.user)
        .subscribe(() => this.router.navigate(['/users']));
    }
    else {
      this.userService.create(this.user)
        .subscribe(createdUser => this.createdUser = createdUser);
    }
  }
}

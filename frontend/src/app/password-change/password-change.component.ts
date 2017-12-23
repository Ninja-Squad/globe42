import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gl-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  model = {
    oldPassword: '',
    newPassword: ''
  };

  passwordChangeFailed = false;

  constructor(private userService: UserService, private router: Router) { }

  changePassword() {
    this.passwordChangeFailed = false;
    this.userService.checkPassword(this.model.oldPassword)
      .switchMap(() => this.userService.changePassword(this.model.newPassword))
      .subscribe(
        () => this.router.navigate(['/']),
        () => this.passwordChangeFailed = true);
  }
}

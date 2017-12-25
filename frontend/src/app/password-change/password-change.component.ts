import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../current-user/current-user.service';

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

  constructor(private currentUserService: CurrentUserService, private router: Router) { }

  changePassword() {
    this.passwordChangeFailed = false;
    this.currentUserService.checkPassword(this.model.oldPassword)
      .switchMap(() => this.currentUserService.changePassword(this.model.newPassword))
      .subscribe(
        () => this.router.navigate(['/']),
        () => this.passwordChangeFailed = true);
  }
}

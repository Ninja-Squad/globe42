import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../current-user/current-user.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
  passwordChangeForm: FormGroup;
  passwordChangeFailed = false;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    fb: FormBuilder
  ) {
    this.passwordChangeForm = fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  changePassword() {
    this.passwordChangeFailed = false;

    if (this.passwordChangeForm.invalid) {
      return;
    }

    this.currentUserService
      .checkPassword(this.passwordChangeForm.value.oldPassword)
      .pipe(
        switchMap(() =>
          this.currentUserService.changePassword(this.passwordChangeForm.value.newPassword)
        )
      )
      .subscribe(
        () => this.router.navigate(['/']),
        () => (this.passwordChangeFailed = true)
      );
  }
}

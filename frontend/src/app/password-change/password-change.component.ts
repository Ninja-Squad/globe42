import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../current-user/current-user.service';
import { switchMap } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
  passwordChangeForm: UntypedFormGroup;
  passwordChangeFailed = false;

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    fb: UntypedFormBuilder
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
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => (this.passwordChangeFailed = true)
      });
  }
}

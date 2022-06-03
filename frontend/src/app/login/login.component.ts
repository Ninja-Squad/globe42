import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../current-user/current-user.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CredentialsCommand } from '../models/credentials.command';

@Component({
  selector: 'gl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  authenticationFailed = false;

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  authenticate() {
    if (this.loginForm.invalid) {
      return;
    }

    const command: CredentialsCommand = this.loginForm.value;
    this.authenticationFailed = false;
    this.currentUserService.authenticate(command).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.authenticationFailed = true)
    });
  }
}

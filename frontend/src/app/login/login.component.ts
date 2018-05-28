import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../current-user/current-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsCommand } from '../models/credentials.command';

@Component({
  selector: 'gl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  authenticationFailed = false;

  constructor(private router: Router,
              private currentUserService: CurrentUserService,
              private fb: FormBuilder) { }

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
    this.currentUserService.authenticate(command)
      .subscribe(
        () => this.router.navigate(['/']),
        () => this.authenticationFailed = true
      );
  }

}

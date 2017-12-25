import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../current-user/current-user.service';

@Component({
  selector: 'gl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials = {
    login: '',
    password: ''
  };
  authenticationFailed = false;

  constructor(private router: Router, private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
  }

  authenticate() {
    this.authenticationFailed = false;
    this.currentUserService.authenticate(this.credentials)
      .subscribe(
        () => this.router.navigate(['/']),
        () => this.authenticationFailed = true
      );
  }

}

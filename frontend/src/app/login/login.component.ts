import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'pr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials = {
    login: '',
    password: ''
  };
  authenticationFailed = false;

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
  }

  authenticate() {
    this.authenticationFailed = false;
    this.userService.authenticate(this.credentials)
      .subscribe(
        () => this.router.navigate(['/']),
        () => this.authenticationFailed = true
      );
  }

}

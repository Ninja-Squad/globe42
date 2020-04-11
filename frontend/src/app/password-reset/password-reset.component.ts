import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserWithPasswordModel } from '../models/user-with-password.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'gl-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  user: UserModel;
  updatedUser: UserWithPasswordModel;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
  }

  resetPassword() {
    this.userService
      .resetPassword(this.user.id)
      .subscribe(updatedUser => (this.updatedUser = updatedUser));
  }
}

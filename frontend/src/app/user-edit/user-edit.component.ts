import { Component, OnInit } from '@angular/core';
import { UserCommand } from '../models/user.command';
import { UserWithPasswordModel } from '../models/user-with-password.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { ErrorService } from '../error.service';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  editedUser: UserModel;
  createdUser: UserWithPasswordModel;

  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private errorService: ErrorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.editedUser = this.route.snapshot.data.user;
    this.userForm = this.fb.group({
      login: [this.editedUser ? this.editedUser.login : '', Validators.required],
      admin: this.editedUser ? this.editedUser.admin : false
    });
  }

  save() {
    if (this.userForm.invalid) {
      return;
    }

    const command: UserCommand = this.userForm.value;
    if (this.editedUser) {
      this.userService.update(this.editedUser.id, command).subscribe({
        next: () => this.router.navigate(['/users']),
        error: this.errorService.functionalErrorHandler()
      });
    } else {
      this.userService.create(command).subscribe({
        next: createdUser => (this.createdUser = createdUser),
        error: this.errorService.functionalErrorHandler()
      });
    }
  }
}

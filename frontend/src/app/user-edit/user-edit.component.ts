import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'gl-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user: UserModel|null;
  userForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.firstNameCtrl = this.fb.control('', Validators.required);
    this.lastNameCtrl = this.fb.control('', Validators.required);
    this.userForm = this.fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl
    });
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  update() {
    const user = this.userForm.value;
    if (this.user && this.user.id !== undefined) {
      user.id = this.user.id;
      this.userService.update(user)
        .subscribe(() => this.router.navigateByUrl('/users'));
    } else {
      this.userService.create(user)
        .subscribe(() => this.router.navigateByUrl('/users'));
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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

  user: UserModel | null;
  userForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  surNameCtrl: FormControl;
  birthDateCtrl: FormControl;
  mediationCodeCtrl: FormControl;
  addressCtrl: FormControl;
  zipCodeCtrl: FormControl;
  cityCtrl: FormControl;
  emailCtrl: FormControl;
  isAdherentCtrl: FormControl;
  entryDateCtrl: FormControl;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private parserFormatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.firstNameCtrl = this.fb.control('', Validators.required);
    this.lastNameCtrl = this.fb.control('', Validators.required);
    this.surNameCtrl = this.fb.control('', Validators.required);
    this.birthDateCtrl = this.fb.control('', Validators.required);
    this.addressCtrl = this.fb.control('', Validators.required);
    this.zipCodeCtrl = this.fb.control('', Validators.required);
    this.emailCtrl = this.fb.control('', [Validators.required, Validators.email]);
    this.isAdherentCtrl = this.fb.control('', Validators.required);
    this.entryDateCtrl = this.fb.control('', Validators.required);
    this.userForm = this.fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      surName: this.surNameCtrl,
      birthDate: this.birthDateCtrl,
      mediationCode: this.mediationCodeCtrl,
      address: this.addressCtrl,
      zipCode: this.zipCodeCtrl,
      city: this.cityCtrl,
      email: this.emailCtrl,
      isAdherent: this.isAdherentCtrl,
      entryDate: this.entryDateCtrl
    });
    if (this.user) {
      this.userForm.patchValue(this.user);
      this.birthDateCtrl.setValue(this.parserFormatter.parse(this.user.birthDate));
      this.entryDateCtrl.setValue(this.parserFormatter.parse(this.user.entryDate));
    }
  }

  update() {
    const user = this.userForm.value;
    user.birthDate = this.parserFormatter.format(this.birthDateCtrl.value);
    user.entryDate = this.parserFormatter.format(this.entryDateCtrl.value);
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

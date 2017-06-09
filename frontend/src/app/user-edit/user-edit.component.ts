import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { UserService } from '../user.service';
import { CityModel, UserModel } from '../models/user.model';
import { SearchCityService } from '../search-city.service';
import { DisplayCityPipe } from '../display-city.pipe';

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
  nickNameCtrl: FormControl;
  genderCtrl: FormControl;
  birthDateCtrl: FormControl;
  mediationCodeCtrl: FormControl;
  addressCtrl: FormControl;
  cityCtrl: FormControl;
  emailCtrl: FormControl;
  phoneNumberCtrl: FormControl;
  isAdherentCtrl: FormControl;
  entryDateCtrl: FormControl;

  searchFailed = false;

  search = (text: Observable<string>) =>
    text
      .filter(query => query.length > 1)
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term =>
        this.searchCityService.search(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }));

  cityFormatter = (result: CityModel) => this.displayCityPipe.transform(result);

  constructor(private userService: UserService,
              private searchCityService: SearchCityService,
              private displayCityPipe: DisplayCityPipe,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private http: Http,
              private parserFormatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.firstNameCtrl = this.fb.control('', Validators.required);
    this.lastNameCtrl = this.fb.control('', Validators.required);
    this.nickNameCtrl = this.fb.control('', Validators.required);
    this.genderCtrl = this.fb.control('', Validators.required);
    this.birthDateCtrl = this.fb.control('', Validators.required);
    this.addressCtrl = this.fb.control('', Validators.required);
    this.cityCtrl = this.fb.control({ }, Validators.required);
    this.emailCtrl = this.fb.control('', [Validators.required, Validators.email]);
    this.phoneNumberCtrl = this.fb.control('', Validators.required);
    this.isAdherentCtrl = this.fb.control('', Validators.required);
    this.entryDateCtrl = this.fb.control('', Validators.required);
    this.userForm = this.fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      nickName: this.nickNameCtrl,
      gender: this.genderCtrl,
      birthDate: this.birthDateCtrl,
      mediationCode: this.mediationCodeCtrl,
      address: this.addressCtrl,
      city: this.cityCtrl,
      email: this.emailCtrl,
      phoneNumber: this.phoneNumberCtrl,
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

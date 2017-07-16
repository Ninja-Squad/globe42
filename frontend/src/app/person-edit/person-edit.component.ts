import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { PersonService } from '../person.service';
import { CityModel, Gender, MaritalStatus, PersonModel } from '../models/person.model';
import { SearchCityService } from '../search-city.service';
import { DisplayCityPipe } from '../display-city.pipe';
import { DisplayMaritalStatusPipe, MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { GENDER_TRANSLATIONS } from '../display-gender.pipe';
import { PersonCommand } from '../models/person.command';

@Component({
  selector: 'gl-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {

  editedPerson: PersonModel | null;

  personForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  nickNameCtrl: FormControl;
  genderCtrl: FormControl;
  birthDateCtrl: FormControl;
  addressCtrl: FormControl;
  cityCtrl: FormControl;
  emailCtrl: FormControl;
  phoneNumberCtrl: FormControl;
  maritalStatusCtrl: FormControl;
  adherentCtrl: FormControl;
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

  genders: Array<Gender> = GENDER_TRANSLATIONS.map(t => t.key);
  maritalStatuses: Array<MaritalStatus> = MARITAL_STATUS_TRANSLATIONS.map(t => t.key);

  constructor(private personService: PersonService,
              private searchCityService: SearchCityService,
              private displayCityPipe: DisplayCityPipe,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private parserFormatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.editedPerson = this.route.snapshot.data['person'];

    this.firstNameCtrl = this.fb.control('', Validators.required);
    this.lastNameCtrl = this.fb.control('', Validators.required);
    this.nickNameCtrl = this.fb.control('', Validators.required);
    this.genderCtrl = this.fb.control('', Validators.required);
    this.birthDateCtrl = this.fb.control('', Validators.required);
    this.addressCtrl = this.fb.control('', Validators.required);
    this.cityCtrl = this.fb.control({ }, Validators.required);
    this.emailCtrl = this.fb.control('', [Validators.required, Validators.email]);
    this.phoneNumberCtrl = this.fb.control('', Validators.required);
    this.maritalStatusCtrl = this.fb.control(null);
    this.adherentCtrl = this.fb.control('', Validators.required);
    this.entryDateCtrl = this.fb.control('', Validators.required);
    this.personForm = this.fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      nickName: this.nickNameCtrl,
      gender: this.genderCtrl,
      birthDate: this.birthDateCtrl,
      address: this.addressCtrl,
      city: this.cityCtrl,
      email: this.emailCtrl,
      phoneNumber: this.phoneNumberCtrl,
      maritalStatus: this.maritalStatusCtrl,
      adherent: this.adherentCtrl,
      entryDate: this.entryDateCtrl
    });
    if (this.editedPerson) {
      this.personForm.patchValue(this.editedPerson);
      this.birthDateCtrl.setValue(this.parserFormatter.parse(this.editedPerson.birthDate));
      this.entryDateCtrl.setValue(this.parserFormatter.parse(this.editedPerson.entryDate));
    }
  }

  save() {
    const command: PersonCommand = this.personForm.value;
    command.birthDate = this.parserFormatter.format(this.birthDateCtrl.value);
    command.entryDate = this.parserFormatter.format(this.entryDateCtrl.value);

    let action;
    if (this.editedPerson && this.editedPerson.id !== undefined) {
      action = this.personService.update(this.editedPerson.id, command);
    } else {
      action = this.personService.create(command);
    }
    action.subscribe(() => this.router.navigateByUrl('/persons'))
  }

}

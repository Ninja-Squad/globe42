import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
import { MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { GENDER_TRANSLATIONS } from '../display-gender.pipe';
import { PersonCommand } from '../models/person.command';
import { HOUSING_TRANSLATIONS } from '../display-housing.pipe';
import { FISCAL_STATUS_TRANSLATIONS } from '../display-fiscal-status.pipe';
import { HEALTH_CARE_COVERAGE_TRANSLATIONS } from '../display-health-care-coverage.pipe';
import { isoToDate, dateToIso } from '../utils';

@Component({
  selector: 'gl-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {

  editedPerson: PersonModel | null;

  personForm: FormGroup;

  genders: Array<Gender> = GENDER_TRANSLATIONS.map(t => t.key);
  maritalStatuses: Array<MaritalStatus> = MARITAL_STATUS_TRANSLATIONS.map(t => t.key);
  housings = HOUSING_TRANSLATIONS.map(t => t.key);
  fiscalStatuses = FISCAL_STATUS_TRANSLATIONS.map(t => t.key);
  healthCareCoverages = HEALTH_CARE_COVERAGE_TRANSLATIONS.map(t => t.key);

  searchFailed = false;

  private static emailOrEmpty(ctrl: FormControl): ValidationErrors {
    if (!ctrl.value) {
      return null;
    }
    return Validators.email(ctrl);
  }

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

  constructor(private personService: PersonService,
              private searchCityService: SearchCityService,
              private displayCityPipe: DisplayCityPipe,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.editedPerson = this.route.snapshot.data['person'];

    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickName: '',
      gender: ['', Validators.required],
      birthDate: null,
      address: '',
      city: null,
      email: ['', PersonEditComponent.emailOrEmpty],
      phoneNumber: '',
      adherent: [null, Validators.required],
      mediationEnabled: false,
      maritalStatus: 'UNKNOWN',
      healthCareCoverage: 'UNKNOWN',
      entryDate: null,
      housing: 'UNKNOWN',
      housingSpace: null,
      fiscalStatus: 'UNKNOWN',
      fiscalStatusDate: null,
      fiscalStatusUpToDate: false
    });

    if (this.editedPerson) {
      if (this.editedPerson.frenchFamilySituation) {
        this.showFrenchFamilySituation();
      }
      if (this.editedPerson.abroadFamilySituation) {
        this.showAbroadFamilySituation();
      }

      this.personForm.patchValue(this.editedPerson);
      ['birthDate', 'entryDate', 'fiscalStatusDate'].forEach(property =>
        this.personForm.get(property).setValue(isoToDate(this.editedPerson[property])));
    }
  }

  showFrenchFamilySituation() {
    this.personForm.addControl('frenchFamilySituation', this.createFamilySituationGroup());
  }

  hideFrenchFamilySituation() {
    this.personForm.removeControl('frenchFamilySituation');
  }

  showAbroadFamilySituation() {
    this.personForm.addControl('abroadFamilySituation', this.createFamilySituationGroup());
  }

  hideAbroadFamilySituation() {
    this.personForm.removeControl('abroadFamilySituation');
  }

  save() {
    const command: PersonCommand = this.personForm.value;
    ['birthDate', 'entryDate', 'fiscalStatusDate'].forEach(property =>
      command[property] = dateToIso(this.personForm.value[property]));

    let action;
    if (this.editedPerson && this.editedPerson.id !== undefined) {
      action = this.personService.update(this.editedPerson.id, command);
    } else {
      action = this.personService.create(command);
    }
    action.subscribe(() => this.router.navigateByUrl('/persons'));
  }

  clearIfNoCity(input: HTMLInputElement) {
    if (!this.personForm.value.city) {
      input.value = null;
    }
  }

  private createFamilySituationGroup(): FormGroup {
    return this.fb.group({
      parentsPresent: this.fb.control(false),
      spousePresent: this.fb.control(false),
      childCount: this.fb.control(''),
      siblingCount: this.fb.control('')
    });
  }
}

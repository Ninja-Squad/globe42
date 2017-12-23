import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PersonService } from '../person.service';
import { Gender, MaritalStatus, PersonModel } from '../models/person.model';
import { SearchCityService } from '../search-city.service';
import { DisplayCityPipe } from '../display-city.pipe';
import { MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { GENDER_TRANSLATIONS } from '../display-gender.pipe';
import { PersonCommand } from '../models/person.command';
import { HOUSING_TRANSLATIONS } from '../display-housing.pipe';
import { FISCAL_STATUS_TRANSLATIONS } from '../display-fiscal-status.pipe';
import { HEALTH_CARE_COVERAGE_TRANSLATIONS } from '../display-health-care-coverage.pipe';
import { PersonTypeahead } from '../person/person-typeahead';
import { FullnamePipe } from '../fullname.pipe';
import { CityTypeahead } from './city-typeahead';

@Component({
  selector: 'gl-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent {

  editedPerson: PersonModel | null;

  personForm: FormGroup;

  genders: Array<Gender> = GENDER_TRANSLATIONS.map(t => t.key);
  maritalStatuses: Array<MaritalStatus> = MARITAL_STATUS_TRANSLATIONS.map(t => t.key);
  housings = HOUSING_TRANSLATIONS.map(t => t.key);
  fiscalStatuses = FISCAL_STATUS_TRANSLATIONS.map(t => t.key);
  healthCareCoverages = HEALTH_CARE_COVERAGE_TRANSLATIONS.map(t => t.key);

  cityTypeahead: CityTypeahead;
  spouseTypeahead: PersonTypeahead;

  private static emailOrEmpty(ctrl: FormControl): ValidationErrors {
    if (!ctrl.value) {
      return null;
    }
    return Validators.email(ctrl);
  }

  constructor(private personService: PersonService,
              private searchCityService: SearchCityService,
              private displayCityPipe: DisplayCityPipe,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private fullnamePipe: FullnamePipe) {
    this.editedPerson = this.route.snapshot.data['person'];

    let persons = this.route.snapshot.data['persons'];
    if (this.editedPerson) {
      persons = persons.filter(p => p.id !== this.editedPerson.id);
    }

    this.cityTypeahead = new CityTypeahead(this.searchCityService, this.displayCityPipe);
    this.spouseTypeahead = new PersonTypeahead(persons, this.fullnamePipe);

    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthName: '',
      nickName: '',
      gender: ['', Validators.required],
      birthDate: null,
      address: '',
      city: null,
      email: ['', PersonEditComponent.emailOrEmpty],
      phoneNumber: '',
      adherent: [false, Validators.required],
      mediationEnabled: false,
      firstMediationAppointmentDate: null,
      maritalStatus: 'UNKNOWN',
      spouse: null,
      healthCareCoverage: 'UNKNOWN',
      healthInsurance: '',
      accompanying: '',
      socialSecurityNumber: '',
      cafNumber: '',
      entryDate: null,
      housing: 'UNKNOWN',
      housingSpace: null,
      hostName: '',
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
    const formValue = this.personForm.value;

    formValue.spouseId = formValue.spouse ? formValue.spouse.id : null;
    delete formValue.spouse;

    const command: PersonCommand = formValue;

    let action;
    if (this.editedPerson && this.editedPerson.id !== undefined) {
      action = this.personService.update(this.editedPerson.id, command).map(() => this.editedPerson.id);
    } else {
      action = this.personService.create(command).map(createdPerson => createdPerson.id);
    }
    action.subscribe((personId) => this.router.navigate(['persons', personId]));
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

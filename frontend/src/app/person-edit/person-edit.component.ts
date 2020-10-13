import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PersonService } from '../person.service';
import { Gender, MaritalStatus, PersonIdentityModel, PersonModel } from '../models/person.model';
import { SearchCityService } from '../search-city.service';
import { MARITAL_STATUS_TRANSLATIONS } from '../display-marital-status.pipe';
import { GENDER_TRANSLATIONS } from '../display-gender.pipe';
import { PersonCommand } from '../models/person.command';
import { HOUSING_TRANSLATIONS } from '../display-housing.pipe';
import { FISCAL_STATUS_TRANSLATIONS } from '../display-fiscal-status.pipe';
import { HEALTH_CARE_COVERAGE_TRANSLATIONS } from '../display-health-care-coverage.pipe';
import { HEALTH_INSURANCE_TRANSLATIONS } from '../display-health-insurance.pipe';
import { PersonTypeahead } from '../person/person-typeahead';
import { CityTypeahead } from './city-typeahead';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CountryTypeahead } from '../person/country-typeahead';
import { VISA_TRANSLATIONS } from '../display-visa.pipe';
import { RESIDENCE_PERMIT_TRANSLATIONS } from '../display-residence-permit.pipe';
import { ENTRY_TYPE_TRANSLATIONS } from '../display-entry-type.pipe';
import { PASSPORT_STATUS_TRANSLATIONS } from '../display-passport-status.pipe';

export const FISCAL_NUMBER_PATTERN = /^\d{13}$/;

function validateValidityDates(
  startPath: string,
  endPath: string,
  error: string,
  condition: (form: FormGroup) => boolean
): (form: FormGroup) => ValidationErrors | null {
  return (form: FormGroup) => {
    if (!condition(form)) {
      return null;
    }

    const startDate = form.get(startPath).value;
    const endDate = form.get(endPath).value;

    if (startDate && endDate && endDate <= startDate) {
      return { [error]: true };
    }
    return null;
  };
}

@Component({
  selector: 'gl-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent {
  editedPerson: PersonModel | null;

  personForm: FormGroup;
  spouseTypeCtrl: FormControl;

  genders: Array<Gender> = GENDER_TRANSLATIONS.map(t => t.key);
  maritalStatuses: Array<MaritalStatus> = MARITAL_STATUS_TRANSLATIONS.map(t => t.key);
  housings = HOUSING_TRANSLATIONS.map(t => t.key);
  fiscalStatuses = FISCAL_STATUS_TRANSLATIONS.map(t => t.key);
  healthCareCoverages = HEALTH_CARE_COVERAGE_TRANSLATIONS.map(t => t.key);
  healthInsurances = HEALTH_INSURANCE_TRANSLATIONS.map(t => t.key);
  visas = VISA_TRANSLATIONS.map(t => t.key);
  residencePermits = RESIDENCE_PERMIT_TRANSLATIONS.map(t => t.key);
  entryTypes = ENTRY_TYPE_TRANSLATIONS.map(t => t.key);
  passportStatuses = PASSPORT_STATUS_TRANSLATIONS.map(t => t.key);

  cityTypeahead: CityTypeahead;
  spouseTypeahead: PersonTypeahead;

  spouseIsInCouple = false;

  countryTypeahead: CountryTypeahead;

  saving = false;

  private static emailOrEmpty(ctrl: FormControl): ValidationErrors {
    if (!ctrl.value) {
      return null;
    }
    return Validators.email(ctrl);
  }

  constructor(
    private personService: PersonService,
    private searchCityService: SearchCityService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editedPerson = this.route.snapshot.data.person;

    let persons: Array<PersonIdentityModel> = this.route.snapshot.data.persons;
    if (this.editedPerson) {
      persons = persons.filter(p => p.id !== this.editedPerson.id);
    }

    this.cityTypeahead = new CityTypeahead(this.searchCityService);
    this.spouseTypeahead = new PersonTypeahead(persons);
    this.countryTypeahead = new CountryTypeahead(this.route.snapshot.data.countries);

    this.personForm = this.fb.group(
      {
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
        mediationEnabled: false,
        firstMediationAppointmentDate: null,
        maritalStatus: 'UNKNOWN',
        spouse: null,
        partner: '',
        healthCareCoverage: 'UNKNOWN',
        healthCareCoverageStartDate: null,
        healthInsurance: 'UNKNOWN',
        healthInsuranceStartDate: null,
        accompanying: '',
        socialSecurityNumber: '',
        cafNumber: '',
        entryDate: null,
        entryType: 'UNKNOWN',
        housing: 'UNKNOWN',
        housingSpace: null,
        hostName: '',
        fiscalStatus: 'UNKNOWN',
        fiscalNumber: ['', Validators.pattern(FISCAL_NUMBER_PATTERN)],
        fiscalStatusUpToDate: false,
        nationality: null,
        passportStatus: 'UNKNOWN',
        passportNumber: '',
        passportValidityStartDate: null,
        passportValidityEndDate: null,
        visa: 'UNKNOWN',
        residencePermit: 'UNKNOWN',
        residencePermitDepositDate: null,
        residencePermitRenewalDate: null,
        residencePermitValidityStartDate: null,
        residencePermitValidityEndDate: null
      },
      {
        validators: [
          validateValidityDates(
            'residencePermitValidityStartDate',
            'residencePermitValidityEndDate',
            'residencePermitValidity',
            () => true
          ),
          validateValidityDates(
            'passportValidityStartDate',
            'passportValidityEndDate',
            'passportValidity',
            form => form.get('passportStatus').value === 'PASSPORT'
          )
        ]
      }
    );

    this.spouseTypeCtrl = new FormControl('none');

    if (this.editedPerson) {
      this.personForm.patchValue(this.editedPerson);
      if (this.editedPerson.spouse) {
        this.spouseTypeCtrl.setValue('spouse');
      } else if (this.editedPerson.partner) {
        this.spouseTypeCtrl.setValue('partner');
      }
    }

    this.personForm
      .get('spouse')
      .valueChanges.pipe(
        tap(() => (this.spouseIsInCouple = false)),
        switchMap(spouse => (spouse ? this.personService.get(spouse.id) : EMPTY))
      )
      .subscribe(
        spouse =>
          (this.spouseIsInCouple =
            !!spouse.partner ||
            !!(spouse.spouse && (!this.editedPerson || spouse.spouse.id !== this.editedPerson.id)))
      );

    // We try to keep the previously entered fiscal number even if the user chooses to set the
    // fiscal status to UNKNOWN, but if it's invalid, that would prevent the form from being submitted
    // so we set it to null in that (unlikely) case.
    this.personForm.get('fiscalStatus').valueChanges.subscribe(value => {
      const fiscalNumberCtrl = this.personForm.get('fiscalNumber');
      if (value === 'UNKNOWN' && fiscalNumberCtrl.invalid) {
        fiscalNumberCtrl.setValue(null);
      }
    });
  }

  save() {
    const formValue = this.personForm.value;

    formValue.spouseId = formValue.spouse ? formValue.spouse.id : null;
    delete formValue.spouse;

    formValue.nationalityId = formValue.nationality ? formValue.nationality.id : null;
    delete formValue.nationality;

    const command: PersonCommand = formValue;
    const spouseType = this.spouseTypeCtrl.value;
    if (spouseType !== 'spouse') {
      command.spouseId = null;
    }
    if (spouseType !== 'partner') {
      command.partner = null;
    }

    if (command.passportStatus !== 'PASSPORT') {
      command.passportNumber = null;
      command.passportValidityStartDate = null;
      command.passportValidityEndDate = null;
    }

    let action;
    if (this.editedPerson?.id !== undefined) {
      action = this.personService
        .update(this.editedPerson.id, command)
        .pipe(map(() => this.editedPerson.id));
    } else {
      action = this.personService.create(command).pipe(map(createdPerson => createdPerson.id));
    }
    this.saving = true;
    action
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(personId => this.router.navigate(['persons', personId]));
  }
}

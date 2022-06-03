import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { PersonService } from '../person.service';
import {
  ENTRY_TYPES,
  FISCAL_STATUSES,
  GENDERS,
  HEALTH_CARE_COVERAGES,
  HEALTH_INSURANCES,
  HOUSINGS,
  MARITAL_STATUSES,
  PASSPORT_STATUSES,
  PersonIdentityModel,
  PersonModel,
  RESIDENCE_PERMITS,
  SCHOOL_LEVELS,
  VISAS
} from '../models/person.model';
import { SearchCityService } from '../search-city.service';
import { PersonCommand } from '../models/person.command';
import { PersonTypeahead } from '../person/person-typeahead';
import { CityTypeahead } from './city-typeahead';
import { combineLatest, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { CountryTypeahead } from '../person/country-typeahead';

export const FISCAL_NUMBER_PATTERN = /^\d{13}$/;

function validateValidityDates(
  startPath: string,
  endPath: string,
  error: string,
  condition: (form: AbstractControl) => boolean
): ValidatorFn {
  return (form: AbstractControl) => {
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

  personForm: UntypedFormGroup;
  spouseTypeCtrl: UntypedFormControl;

  genders = GENDERS;
  maritalStatuses = MARITAL_STATUSES;
  housings = HOUSINGS;
  fiscalStatuses = FISCAL_STATUSES;
  healthCareCoverages = HEALTH_CARE_COVERAGES;
  healthInsurances = HEALTH_INSURANCES;
  visas = VISAS;
  residencePermits = RESIDENCE_PERMITS;
  entryTypes = ENTRY_TYPES;
  passportStatuses = PASSPORT_STATUSES;
  schoolLevels = SCHOOL_LEVELS;

  cityTypeahead: CityTypeahead;
  spouseTypeahead: PersonTypeahead;

  spouseIsInCouple = false;

  countryTypeahead: CountryTypeahead;

  saving = false;
  similarPerson: PersonIdentityModel | null = null;

  private static emailOrEmpty(ctrl: UntypedFormControl): ValidationErrors {
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
    private fb: UntypedFormBuilder
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
        lastHealthCheckDate: null,
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
        residencePermitValidityEndDate: null,
        schoolLevel: 'UNKNOWN'
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

    this.spouseTypeCtrl = new UntypedFormControl('none');

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

    combineLatest([
      this.personForm.get('firstName').valueChanges,
      this.personForm.get('lastName').valueChanges
    ]).subscribe(([firstName, lastName]) => {
      const lowercaseFirstName = firstName.toLowerCase();
      const lowercaseLastName = lastName.toLowerCase();
      this.similarPerson =
        persons.find(
          p =>
            (p.firstName.toLowerCase() === lowercaseFirstName &&
              p.lastName.toLowerCase() === lowercaseLastName) ||
            (p.lastName.toLowerCase() === lowercaseFirstName &&
              p.firstName.toLowerCase() === lowercaseLastName)
        ) ?? null;
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

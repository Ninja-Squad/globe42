import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ParticipationService } from '../participation.service';
import { map, mapTo, shareReplay, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { PersonIdentityModel } from '../models/person.model';
import { PersonService } from '../person.service';
import { Activity, ActivityCommand } from '../models/activity.model';
import { sortBy } from '../utils';
import { displayFullname } from '../fullname.pipe';
import { ACTIVITY_TYPES, ActivityType } from '../models/activity-type.model';

interface FormValue {
  type: ActivityType;
  date: string;
  participants: Array<PersonIdentityModel>;
}

@Component({
  selector: 'gl-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss']
})
export class ActivityEditComponent implements OnInit {
  form: FormGroup;
  showAllPersonsCtrl: FormControl;

  choosablePersons$: Observable<Array<PersonIdentityModel>>;
  editedActivity: Activity | null;

  activityTypes = ACTIVITY_TYPES;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    participationService: ParticipationService,
    personService: PersonService,
    private router: Router
  ) {
    this.form = fb.group({
      type: [null, Validators.required],
      date: [null, Validators.required],
      participants: [[]]
    } as Record<keyof FormValue, any>);

    this.showAllPersonsCtrl = fb.control(false);

    const showAllPersonsSubject = new BehaviorSubject<boolean>(this.showAllPersonsCtrl.value);
    const activityTypeSubject = new BehaviorSubject<ActivityType | null>(
      (this.form.value as FormValue).type
    );
    const chosenPersonsSubject = new BehaviorSubject<Array<PersonIdentityModel>>(
      (this.form.value as FormValue).participants
    );

    this.form.get('type').valueChanges.subscribe(activityTypeSubject);
    this.showAllPersonsCtrl.valueChanges.subscribe(showAllPersonsSubject);
    this.form.get('participants').valueChanges.subscribe(chosenPersonsSubject);

    const activityTypeParticipants$: Observable<Array<PersonIdentityModel>> =
      activityTypeSubject.pipe(
        switchMap(activityType =>
          activityType ? participationService.listParticipants(activityType) : of([])
        ),
        shareReplay()
      );

    const allPersons$: Observable<Array<PersonIdentityModel>> = personService
      .list()
      .pipe(shareReplay());

    const allChoosablePersons$: Observable<Array<PersonIdentityModel>> = showAllPersonsSubject.pipe(
      switchMap(showAll => (showAll ? allPersons$ : activityTypeParticipants$))
    );

    this.choosablePersons$ = combineLatest([allChoosablePersons$, chosenPersonsSubject]).pipe(
      map(([allChoosablePersons, chosenPersons]) =>
        sortBy(
          allChoosablePersons.filter(
            choosablePerson =>
              !chosenPersons.some(chosenPerson => chosenPerson.id === choosablePerson.id)
          ),
          displayFullname
        )
      )
    );
  }

  ngOnInit(): void {
    this.editedActivity = this.route.snapshot.data.activity ?? null;
    if (this.editedActivity) {
      const value: FormValue = {
        type: this.editedActivity.type.key,
        date: this.editedActivity.date,
        participants: this.editedActivity.participants
      };
      this.form.setValue(value);
    }
  }

  choosePerson(person: PersonIdentityModel) {
    let participants: Array<PersonIdentityModel> = this.form.value.participants;
    participants = sortBy([...participants, person], displayFullname);
    this.form.patchValue({ participants });
  }

  unchoosePerson(person: PersonIdentityModel) {
    let participants: Array<PersonIdentityModel> = this.form.value.participants;
    participants = participants.filter(p => p.id !== person.id);
    this.form.patchValue({ participants });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formValue: FormValue = this.form.value;
    const command: ActivityCommand = {
      date: formValue.date,
      type: formValue.type,
      participantIds: formValue.participants.map(p => p.id)
    };

    let obs$: Observable<number>;
    if (this.editedActivity) {
      obs$ = this.activityService
        .update(this.editedActivity.id, command)
        .pipe(mapTo(this.editedActivity.id));
    } else {
      obs$ = this.activityService.create(command).pipe(map(activity => activity.id));
    }

    obs$.subscribe(activityId => this.router.navigate(['/activities', activityId]));
  }
}

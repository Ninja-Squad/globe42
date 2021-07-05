import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembershipModel, PAYMENT_MODES } from '../models/membership.model';
import { DateTime } from 'luxon';
import { PersonModel } from '../models/person.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { min, pastDate } from '../globe-validators';
import { MembershipService } from '../membership.service';
import { MembershipCommand } from '../models/membership.command';
import { ConfirmService } from '../confirm.service';
import { switchMap, tap } from 'rxjs';
import { CurrentPersonService } from '../current-person.service';
import { CurrentPersonReminderService } from '../current-person-reminder.service';

@Component({
  selector: 'gl-person-memberships',
  templateUrl: './person-memberships.component.html',
  styleUrls: ['./person-memberships.component.scss']
})
export class PersonMembershipsComponent implements OnInit {
  currentMembership: MembershipModel | null = null;
  oldMemberships: Array<MembershipModel>;
  currentYear: number;
  person: PersonModel;

  membershipForm: FormGroup;

  paymentModes = PAYMENT_MODES.filter(mode => mode !== 'UNKNOWN');

  choosableOldMembershipYears: Array<number> = [];
  oldMembershipFormVisible = false;
  oldMembershipForm: FormGroup;

  constructor(
    private currentPersonService: CurrentPersonService,
    private currentPersonReminderService: CurrentPersonReminderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private membershipService: MembershipService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.person = this.currentPersonService.snapshot;
    const memberships = this.route.snapshot.data.memberships;
    this.initialize(memberships);
  }

  createCurrentMembership() {
    if (this.membershipForm.invalid) {
      return;
    }
    const command = this.membershipForm.value as MembershipCommand;
    command.year = this.currentYear;

    this.membershipService
      .createCurrent(this.person.id, command)
      .pipe(
        tap(() => this.currentPersonReminderService.refresh()),
        switchMap(() => this.membershipService.list(this.person.id))
      )
      .subscribe(memberships => this.initialize(memberships));
  }

  deleteCurrentMembership() {
    this.confirmService
      .confirm({
        message: `Voulez-vous vraiment supprimer l'adhésion\u00a0?`
      })
      .pipe(
        switchMap(() =>
          this.membershipService.deleteCurrent(this.person.id, this.currentMembership.id)
        ),
        tap(() => this.currentPersonReminderService.refresh()),
        switchMap(() => this.membershipService.list(this.person.id))
      )
      .subscribe(memberships => this.initialize(memberships));
  }

  displayOldMembershipForm() {
    this.oldMembershipForm = this.fb.group({
      year: [null, Validators.required],
      paymentMode: [null, Validators.required],
      paymentDate: [DateTime.local().toISODate(), [Validators.required, pastDate]],
      cardNumber: [null, Validators.required]
    });
    this.oldMembershipFormVisible = true;
  }

  createOldMembership() {
    if (this.oldMembershipForm.invalid) {
      return;
    }
    const command = this.oldMembershipForm.value as MembershipCommand;

    this.membershipService
      .createOld(this.person.id, command)
      .pipe(
        tap(() => (this.oldMembershipFormVisible = false)),
        switchMap(() => this.membershipService.list(this.person.id))
      )
      .subscribe(memberships => this.initialize(memberships));
  }

  deleteOldMembership(membership: MembershipModel) {
    this.confirmService
      .confirm({
        message: `Voulez-vous vraiment supprimer l'adhésion de l'année ${membership.year}\u00a0?`
      })
      .pipe(
        switchMap(() => this.membershipService.deleteOld(this.person.id, membership.id)),
        switchMap(() => this.membershipService.list(this.person.id))
      )
      .subscribe(memberships => this.initialize(memberships));
  }

  private initialize(memberships: Array<MembershipModel>) {
    this.currentYear = DateTime.local().year;
    // memberships are sorted from latest to oldest, so the current one can only be the first one
    if (memberships.length > 0 && memberships[0].year === this.currentYear) {
      this.currentMembership = memberships[0];
      this.oldMemberships = memberships.slice(1);
    } else {
      this.currentMembership = null;
      this.oldMemberships = memberships;
    }

    this.membershipForm = this.fb.group({
      paymentMode: [null, Validators.required],
      paymentDate: [
        DateTime.local().toISODate(),
        [Validators.required, min(DateTime.local(this.currentYear, 1, 1).toISODate()), pastDate]
      ],
      cardNumber: [null, Validators.required]
    });

    this.choosableOldMembershipYears = [];
    for (let year = 2018; year < this.currentYear; year++) {
      if (!memberships.some(m => m.year === year)) {
        this.choosableOldMembershipYears.push(year);
      }
    }
  }
}

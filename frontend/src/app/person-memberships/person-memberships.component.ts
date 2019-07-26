import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembershipModel } from '../models/membership.model';
import { DateTime } from 'luxon';
import { PersonModel } from '../models/person.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { min, pastDate } from '../globe-validators';
import { MembershipService } from '../membership.service';
import { MembershipCommand } from '../models/membership.command';
import { ConfirmService } from '../confirm.service';
import { switchMap } from 'rxjs/operators';
import { PAYMENT_MODE_TRANSLATIONS } from '../display-payment-mode.pipe';
import { CurrentPersonService } from '../current-person.service';

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

  paymentModes = PAYMENT_MODE_TRANSLATIONS.map(t => t.key).filter(key => key !== 'UNKNOWN');

  constructor(private currentPersonService: CurrentPersonService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private membershipService: MembershipService,
              private confirmService: ConfirmService) { }

  ngOnInit() {
    const memberships = this.route.snapshot.data.memberships;
    this.currentYear = DateTime.local().year;
    // memberships are sorted from latest to oldest, so the current one can only be the first one
    if (memberships.length > 0 && memberships[0].year === this.currentYear) {
      this.currentMembership = memberships[0];
      this.oldMemberships = memberships.slice(1);
    } else {
      this.oldMemberships = memberships;
    }
    this.person = this.currentPersonService.snapshot;

    this.membershipForm = this.fb.group({
      paymentMode: [null, Validators.required],
      paymentDate: [DateTime.local().toISODate(), [
        Validators.required,
        min(DateTime.local(this.currentYear, 1, 1).toISODate()),
        pastDate
      ]],
      cardNumber: [null, Validators.required]
    });
  }

  createCurrentMembership() {
    const command = this.membershipForm.value as MembershipCommand;
    command.year = this.currentYear;

    this.membershipService.createCurrent(this.person.id, command).subscribe(
      membership => this.currentMembership = membership
    );
  }

  deleteCurrentMembership() {
    this.confirmService.confirm({
      message: `Voulez-vous vraiment supprimer l'adhésion\u00a0?`
    }).pipe(
      switchMap(() => this.membershipService.deleteCurrent(this.person.id, this.currentMembership.id))
    ).subscribe(() => this.currentMembership = null);
  }
}

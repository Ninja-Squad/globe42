import { Component } from '@angular/core';
import { PersonModel } from '../models/person.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../person.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { pastDate } from '../globe-validators';
import { CurrentPersonService } from '../current-person.service';
import { switchMap } from 'rxjs';
import { CurrentPersonReminderService } from '../current-person-reminder.service';

@Component({
  selector: 'gl-person-death',
  templateUrl: './person-death.component.html',
  styleUrls: ['./person-death.component.scss']
})
export class PersonDeathComponent {
  person: PersonModel;
  form: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private currentPersonService: CurrentPersonService,
    private currentPersonReminderService: CurrentPersonReminderService,
    fb: UntypedFormBuilder,
    private personService: PersonService,
    private router: Router
  ) {
    this.person = currentPersonService.snapshot;
    this.form = fb.group({
      deathDate: [null, [Validators.required, pastDate]]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.personService
      .signalDeath(this.person.id, this.form.value)
      .pipe(switchMap(() => this.currentPersonService.refresh(this.person.id)))
      .subscribe(() => {
        this.currentPersonReminderService.refresh();
        this.router.navigate(['..', 'info'], { relativeTo: this.route });
      });
  }
}

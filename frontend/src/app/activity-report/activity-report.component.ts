import { Component, OnInit } from '@angular/core';
import { ACTIVITY_TYPES, ActivityType } from '../models/activity-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivityReport } from '../models/activity.model';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ActivityService } from '../activity.service';
import { DateTime } from 'luxon';

interface FormValue {
  type: ActivityType;
  from: string;
  to: string;
}

@Component({
  selector: 'gl-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.scss']
})
export class ActivityReportComponent implements OnInit {
  form: FormGroup;
  report$: Observable<ActivityReport | null>;
  activityTypes = ACTIVITY_TYPES;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    router: Router,
    activityService: ActivityService
  ) {
    this.form = fb.group({
      type: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required]
    });

    const formValueSubject = new BehaviorSubject<FormValue>(this.form.value);
    this.form.valueChanges.subscribe(formValueSubject);

    this.report$ = formValueSubject.pipe(
      tap(formValue =>
        router.navigate(['.'], { relativeTo: this.route, queryParams: formValue, replaceUrl: true })
      ),
      switchMap(formValue =>
        this.form.valid
          ? activityService
              .report(formValue.type, formValue.from, formValue.to)
              .pipe(catchError(() => of(null)))
          : of(null)
      )
    );
  }

  ngOnInit(): void {
    const paramMap = this.route.snapshot.queryParamMap;
    if (!paramMap.get('type') && !paramMap.get('from') && !paramMap.get('to')) {
      const now = DateTime.local();
      this.form.setValue({
        type: ACTIVITY_TYPES[0].key,
        from: now.startOf('year').toISODate(),
        to: now.endOf('month').toISODate()
      });
    } else {
      this.form.setValue({
        type: paramMap.get('type'),
        from: paramMap.get('from'),
        to: paramMap.get('to')
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ACTIVITY_TYPES, ActivityType } from '../models/activity-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ActivityReport, Presence } from '../models/activity.model';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ActivityService } from '../activity.service';
import { DateTime } from 'luxon';
import { Comparator, sortBy } from '../utils';
import { displayFullname } from '../fullname.pipe';

interface FormValue {
  type: ActivityType;
  from: string;
  to: string;
}

interface Sorting {
  column: 'person' | 'activityCount';
  desc: boolean;
}

interface ViewModel {
  report: ActivityReport;
  sorting: Sorting;
}

@Component({
  selector: 'gl-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.scss']
})
export class ActivityReportComponent implements OnInit {
  form: FormGroup;
  vm$: Observable<ViewModel | null>;
  activityTypes = ACTIVITY_TYPES;

  sortingSubject = new BehaviorSubject<Sorting>({ column: 'person', desc: false });

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

    this.vm$ = formValueSubject.pipe(
      tap(formValue =>
        router.navigate(['.'], { relativeTo: this.route, queryParams: formValue, replaceUrl: true })
      ),
      switchMap(formValue =>
        this.form.valid
          ? combineLatest([
              activityService.report(formValue.type, formValue.from, formValue.to),
              this.sortingSubject
            ]).pipe(
              map(([report, sorting]) => ({ report: this.sortedReport(report, sorting), sorting })),
              catchError(() => of(null))
            )
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

  private sortedReport(report: ActivityReport, sorting: Sorting): ActivityReport {
    return { ...report, presences: this.sortedPresences(report.presences, sorting) };
  }

  private sortedPresences(presences: Array<Presence>, sorting: Sorting) {
    let comparator =
      sorting.column === 'activityCount'
        ? Comparator.comparing<Presence>(presence => presence.activityCount).thenComparing(
            presence => displayFullname(presence.person)
          )
        : Comparator.comparing<Presence>(presence => displayFullname(presence.person));
    if (sorting.desc) {
      comparator = comparator.reversed();
    }
    return sortBy(presences, comparator);
  }

  sortBy(column: 'person' | 'activityCount') {
    const sorting = this.sortingSubject.getValue();
    if (sorting.column === column) {
      this.sortingSubject.next({ ...sorting, desc: !sorting.desc });
    } else {
      this.sortingSubject.next({ column, desc: false });
    }
  }
}

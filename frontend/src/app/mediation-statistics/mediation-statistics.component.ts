import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { MediationReportModel } from '../mediation-statistics.model';
import { MediationStatisticsService } from '../mediation-statistics.service';

interface FormValue {
  from: string;
  to: string;
}

@Component({
  selector: 'gl-mediation-statistics',
  templateUrl: './mediation-statistics.component.html',
  styleUrls: ['./mediation-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediationStatisticsComponent implements OnInit {
  form: FormGroup;
  report$: Observable<MediationReportModel | null>;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    router: Router,
    mediationStatisticsService: MediationStatisticsService
  ) {
    this.form = fb.group({
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
          ? mediationStatisticsService
              .get(formValue.from, formValue.to)
              .pipe(catchError(() => of(null)))
          : of(null)
      )
    );
  }

  ngOnInit(): void {
    const paramMap = this.route.snapshot.queryParamMap;
    if (!paramMap.get('from') && !paramMap.get('to')) {
      const now = DateTime.local();
      this.form.setValue({
        from: now.startOf('year').toISODate(),
        to: now.endOf('month').toISODate()
      });
    } else {
      this.form.setValue({
        from: paramMap.get('from'),
        to: paramMap.get('to')
      });
    }
  }
}

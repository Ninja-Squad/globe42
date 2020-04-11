import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { merge, Observable, timer } from 'rxjs';
import { filter, first, map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';

export interface Progress {
  value: number;
}

@Component({
  selector: 'gl-navigation-progress',
  templateUrl: './navigation-progress.component.html',
  styleUrls: ['./navigation-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationProgressComponent implements OnInit {
  progress$: Observable<Progress | null>;

  constructor(private router: Router) {}

  ngOnInit() {
    const end$ = this.router.events.pipe(
      filter(
        e =>
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError
      )
    );

    this.progress$ = this.router.events.pipe(
      filter(e => e instanceof NavigationStart), // trigger the emission when a navigation starts
      switchMap(() =>
        merge(
          // then emit every 500ms, and when the navigation ends or cancels or errors. This delay must
          // match the transition duration in the .scss file
          timer(0, 500).pipe(
            map(i => 100 - 100 / Math.pow(2, i)), // emit 0 then 50, 75, 87.5, etc.
            takeWhile(i => i < 99.95), // stop because that just triggers change detection with no visual change anymore
            takeUntil(end$), // but stop emitting every 500ms when the navigation ends or cancels or errors
            map(i => ({ value: i }))
          ),
          end$.pipe(
            first(),
            map(() => null)
          ) // set back to null when the navigation ends or cancels or errors to hide
          // the progress bar
        )
      )
    );
  }
}

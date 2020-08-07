import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NavigationProgressComponent } from './navigation-progress.component';
import { ComponentTester } from 'ngx-speculoos';
import { By } from '@angular/platform-browser';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent
} from '@angular/router';
import { Subject } from 'rxjs';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';

class NavigationProgressComponentTester extends ComponentTester<NavigationProgressComponent> {
  constructor() {
    super(NavigationProgressComponent);
  }

  get progressBar(): NgbProgressbar | null {
    const debugElement = this.debugElement.query(By.directive(NgbProgressbar));
    return debugElement?.componentInstance || null;
  }

  get progressValue() {
    const p = this.progressBar;
    return p?.value ?? null;
  }

  adance(millis: number) {
    tick(millis);
    this.detectChanges();
  }
}

describe('NavigationProgressComponent', () => {
  let tester: NavigationProgressComponentTester;
  let events$: Subject<RouterEvent>;

  beforeEach(() => {
    events$ = new Subject<RouterEvent>();

    const fakeRouter = {
      events: events$.asObservable()
    } as Router;

    TestBed.configureTestingModule({
      declarations: [NavigationProgressComponent],
      imports: [GlobeNgbTestingModule],
      providers: [{ provide: Router, useValue: fakeRouter }]
    });

    tester = new NavigationProgressComponentTester();
    tester.detectChanges();
  });

  it('should not display any progress bar initially', () => {
    expect(tester.progressBar).toBeNull();
  });

  it('should display a progress bar at value 0 when navigation starts, and remove it if it ends before 500ms', fakeAsync(() => {
    events$.next(new NavigationStart(0, 'foo'));
    tester.adance(1);

    expect(tester.progressBar).not.toBeNull();
    expect(tester.progressValue).toBe(0);
    tester.adance(490);

    expect(tester.progressValue).toBe(0);
    events$.next(new NavigationEnd(0, 'foo', null));
    tester.adance(100);

    expect(tester.progressBar).toBeNull();
  }));

  it('should display a progress bar with increasing values, and remove it navigation ends', fakeAsync(() => {
    events$.next(new NavigationStart(0, 'foo'));
    tester.adance(1);

    expect(tester.progressValue).toBe(0);
    tester.adance(500);
    expect(tester.progressValue).toBe(50);
    tester.adance(500);
    expect(tester.progressValue).toBe(75);
    tester.adance(500);
    expect(tester.progressValue).toBe(87.5);
    tester.adance(500);
    expect(tester.progressValue).toBe(93.75);
    tester.adance(500);
    expect(tester.progressValue).toBe(96.875);
    events$.next(new NavigationCancel(0, 'foo', null));
    tester.detectChanges();
    expect(tester.progressBar).toBeNull();
  }));
});

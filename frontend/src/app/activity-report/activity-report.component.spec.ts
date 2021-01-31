import { TestBed } from '@angular/core/testing';

import { ActivityReportComponent } from './activity-report.component';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { ActivityService } from '../activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ValdemortModule } from 'ngx-valdemort';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ACTIVITY_TYPES } from '../models/activity-type.model';
import { ActivityReport } from '../models/activity.model';
import { FullnamePipe } from '../fullname.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { PageTitleDirective } from '../page-title.directive';

class ActivityReportComponentTester extends ComponentTester<ActivityReportComponent> {
  constructor() {
    super(ActivityReportComponent);
  }

  get type() {
    return this.select('#type');
  }

  get from() {
    return this.input('#from');
  }

  get to() {
    return this.input('#to');
  }

  get reportTitle() {
    return this.element('h2');
  }

  get reportHeadings() {
    return this.elements<HTMLTableHeaderCellElement>('thead th');
  }

  get reportRows() {
    return this.elements('tbody tr');
  }

  get errors() {
    return this.elements('val-errors div');
  }
}

describe('ActivityReportComponent', () => {
  let tester: ActivityReportComponentTester;
  let activityService: jasmine.SpyObj<ActivityService>;
  let router: Router;

  function configureTestingModule(route: ActivatedRoute) {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ValdemortModule, GlobeNgbTestingModule, RouterTestingModule],
      declarations: [
        ActivityReportComponent,
        ValidationDefaultsComponent,
        FullnamePipe,
        PageTitleDirective
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: ActivityService, useValue: activityService }
      ]
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
  }

  beforeEach(() => {
    activityService = jasmine.createSpyObj<ActivityService>('ActivityService', ['report']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    jasmine.clock().mockDate(DateTime.fromISO('2021-02-10').toJSDate());
  });

  afterEach(() => jasmine.clock().uninstall());

  describe('without query params', () => {
    beforeEach(() => {
      const route = fakeRoute({
        snapshot: fakeSnapshot({
          queryParams: {}
        })
      });

      configureTestingModule(route);
      tester = new ActivityReportComponentTester();
    });

    it('should initialize form with default values', () => {
      activityService.report.and.returnValue(of({ totalActivityCount: 0, presences: [] }));

      tester.detectChanges();

      expect(tester.type).toHaveSelectedLabel(ACTIVITY_TYPES[0].name);
      expect(tester.from).toHaveValue('01/01/2021');
      expect(tester.to).toHaveValue('28/02/2021');

      expect(router.navigate).toHaveBeenCalled();
      expect(activityService.report).toHaveBeenCalledWith(
        ACTIVITY_TYPES[0].key,
        '2021-01-01',
        '2021-02-28'
      );
      expect(tester.reportTitle).toContainText('Aucune activité');
    });

    it('should reload the report when values change', () => {
      activityService.report.and.returnValues(
        of({ totalActivityCount: 0, presences: [] }),
        of({ totalActivityCount: 1, presences: [] }),
        of({ totalActivityCount: 2, presences: [] }),
        of({ totalActivityCount: 3, presences: [] })
      );

      tester.detectChanges();

      expect(activityService.report).toHaveBeenCalledWith(
        ACTIVITY_TYPES[0].key,
        '2021-01-01',
        '2021-02-28'
      );
      expect(tester.reportTitle).toContainText('Aucune activité');

      tester.type.selectLabel('Repas');

      expect(activityService.report).toHaveBeenCalledWith('MEAL', '2021-01-01', '2021-02-28');
      expect(tester.reportTitle).toContainText('1 activité');

      tester.from.fillWith('01/02/2021');

      expect(activityService.report).toHaveBeenCalledWith('MEAL', '2021-02-01', '2021-02-28');
      expect(tester.reportTitle).toContainText('2 activités');

      tester.to.fillWith('01/03/2021');

      expect(activityService.report).toHaveBeenCalledWith('MEAL', '2021-02-01', '2021-03-01');
      expect(tester.reportTitle).toContainText('3 activités');
      expect(router.navigate).toHaveBeenCalledTimes(4);
    });

    it('should display and sort the presences', () => {
      activityService.report.and.returnValue(
        of({
          totalActivityCount: 10,
          presences: [
            {
              person: {
                firstName: 'JB',
                lastName: 'Nizet'
              },
              activityCount: 6
            },
            {
              person: {
                firstName: 'Cedric',
                lastName: 'Exbrayat'
              },
              activityCount: 6
            },
            {
              person: {
                firstName: 'Claire',
                lastName: 'Brucy'
              },
              activityCount: 7
            }
          ]
        } as ActivityReport)
      );

      tester.detectChanges();

      expect(tester.reportRows.length).toBe(3);
      expect(tester.reportRows[0]).toContainText('Cedric Exbrayat');
      expect(tester.reportRows[0]).toContainText('6');
      expect(tester.reportRows[0]).toContainText('60%');
      expect(tester.reportRows[1]).toContainText('Claire Brucy');
      expect(tester.reportRows[1]).toContainText('7');
      expect(tester.reportRows[1]).toContainText('70%');
      expect(tester.reportRows[2]).toContainText('JB Nizet');
      expect(tester.reportRows[2]).toContainText('6');
      expect(tester.reportRows[2]).toContainText('60%');

      tester.reportHeadings[0].click();
      expect(tester.reportRows[0]).toContainText('JB Nizet');
      expect(tester.reportRows[1]).toContainText('Claire Brucy');
      expect(tester.reportRows[2]).toContainText('Cedric Exbrayat');

      tester.reportHeadings[0].click();
      expect(tester.reportRows[0]).toContainText('Cedric Exbrayat');
      expect(tester.reportRows[1]).toContainText('Claire Brucy');
      expect(tester.reportRows[2]).toContainText('JB Nizet');

      tester.reportHeadings[1].click();
      expect(tester.reportRows[0]).toContainText('Cedric Exbrayat');
      expect(tester.reportRows[1]).toContainText('JB Nizet');
      expect(tester.reportRows[2]).toContainText('Claire Brucy');

      tester.reportHeadings[1].click();
      expect(tester.reportRows[0]).toContainText('Claire Brucy');
      expect(tester.reportRows[1]).toContainText('JB Nizet');
      expect(tester.reportRows[2]).toContainText('Cedric Exbrayat');
    });

    it('should validate', () => {
      activityService.report.and.returnValues(
        of({ totalActivityCount: 0, presences: [] }),
        of({ totalActivityCount: 1, presences: [] })
      );

      tester.detectChanges();

      tester.type.selectLabel('');
      expect(tester.reportTitle).toBeNull();
      tester.type.dispatchEventOfType('blur');
      tester.from.fillWith('');
      expect(tester.reportTitle).toBeNull();
      tester.from.dispatchEventOfType('blur');
      tester.to.fillWith('');
      expect(tester.reportTitle).toBeNull();
      tester.to.dispatchEventOfType('blur');

      expect(tester.errors.length).toBe(3);

      tester.type.selectLabel('Repas');
      expect(tester.reportTitle).toBeNull();
      tester.from.fillWith('01/01/2021');
      expect(tester.reportTitle).toBeNull();
      tester.to.fillWith('31/01/2021');
      expect(tester.reportTitle).not.toBeNull();
      expect(tester.reportTitle).toContainText('1 activité');
    });
  });

  describe('with query params', () => {
    beforeEach(() => {
      const route = fakeRoute({
        snapshot: fakeSnapshot({
          queryParams: {
            type: 'MEAL',
            from: '2020-01-01',
            to: '2020-12-31'
          }
        })
      });

      configureTestingModule(route);
      tester = new ActivityReportComponentTester();
    });

    it('should have populated form', () => {
      activityService.report.and.returnValue(of({ totalActivityCount: 0, presences: [] }));

      tester.detectChanges();

      expect(tester.type).toHaveSelectedLabel('Repas');
      expect(tester.from).toHaveValue('01/01/2020');
      expect(tester.to).toHaveValue('31/12/2020');

      expect(router.navigate).toHaveBeenCalled();
      expect(activityService.report).toHaveBeenCalledWith('MEAL', '2020-01-01', '2020-12-31');
      expect(tester.reportTitle).toContainText('Aucune activité');
    });
  });
});

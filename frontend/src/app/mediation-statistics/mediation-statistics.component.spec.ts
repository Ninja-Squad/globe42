import { TestBed } from '@angular/core/testing';

import { MediationStatisticsComponent } from './mediation-statistics.component';
import { ComponentTester, stubRoute } from 'ngx-speculoos';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ValdemortModule } from 'ngx-valdemort';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { FullnamePipe } from '../fullname.pipe';
import { PageTitleDirective } from '../page-title.directive';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { MediationStatisticsService } from '../mediation-statistics.service';
import { MediationReportModel } from '../mediation-statistics.model';

class MediationStatisticsComponentTester extends ComponentTester<MediationStatisticsComponent> {
  constructor() {
    super(MediationStatisticsComponent);
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

  get blocks() {
    return this.elements('.block');
  }

  get errors() {
    return this.elements('val-errors div');
  }
}

describe('MediationStatisticsComponent', () => {
  let tester: MediationStatisticsComponentTester;
  let mediationStatisticsService: jasmine.SpyObj<MediationStatisticsService>;
  let router: Router;

  function configureTestingModule(route: ActivatedRoute) {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ValdemortModule, GlobeNgbTestingModule, RouterTestingModule],
      declarations: [
        MediationStatisticsComponent,
        ValidationDefaultsComponent,
        FullnamePipe,
        PageTitleDirective
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: MediationStatisticsService, useValue: mediationStatisticsService }
      ]
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
  }

  beforeEach(() => {
    mediationStatisticsService = jasmine.createSpyObj<MediationStatisticsService>(
      'MediationStatisticsService',
      ['get']
    );
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    jasmine.clock().mockDate(DateTime.fromISO('2021-02-10').toJSDate());
  });

  afterEach(() => jasmine.clock().uninstall());

  describe('without query params', () => {
    beforeEach(() => {
      const route = stubRoute();

      configureTestingModule(route);
      tester = new MediationStatisticsComponentTester();
    });

    it('should initialize form with default values', () => {
      mediationStatisticsService.get.and.returnValue(
        of({ appointmentCount: 0 } as MediationReportModel)
      );

      tester.detectChanges();

      expect(tester.from).toHaveValue('01/01/2021');
      expect(tester.to).toHaveValue('28/02/2021');

      expect(router.navigate).toHaveBeenCalled();
      expect(mediationStatisticsService.get).toHaveBeenCalledWith('2021-01-01', '2021-02-28');
      expect(tester.reportTitle).toContainText('0 rendez-vous');
    });

    it('should reload the report when values change', () => {
      const report: MediationReportModel = {
        appointmentCount: 0,
        averageIncomeMonthlyAmount: 1000,
        averageAge: 65,
        userAppointments: [],
        personAppointments: [],
        ageRangeAppointments: [],
        nationalityAppointments: []
      };

      mediationStatisticsService.get.and.returnValues(
        of({ ...report, appointmentCount: 0 }),
        of({ ...report, appointmentCount: 1 }),
        of({ ...report, appointmentCount: 2 })
      );

      tester.detectChanges();

      expect(mediationStatisticsService.get).toHaveBeenCalledWith('2021-01-01', '2021-02-28');
      expect(tester.reportTitle).toContainText('0 rendez-vous');
      expect(tester.blocks.length).toBe(0);

      tester.from.fillWith('01/01/2020');

      expect(mediationStatisticsService.get).toHaveBeenCalledWith('2020-01-01', '2021-02-28');
      expect(tester.reportTitle).toContainText('1 rendez-vous');

      tester.to.fillWith('01/03/2021');

      expect(mediationStatisticsService.get).toHaveBeenCalledWith('2020-01-01', '2021-03-01');
      expect(tester.reportTitle).toContainText('2 rendez-vous');
      expect(router.navigate).toHaveBeenCalledTimes(3);
    });

    it('should validate', () => {
      const report: MediationReportModel = {
        appointmentCount: 0,
        averageIncomeMonthlyAmount: 1000,
        averageAge: 65,
        userAppointments: [],
        personAppointments: [],
        ageRangeAppointments: [],
        nationalityAppointments: []
      };

      mediationStatisticsService.get.and.returnValues(
        of({ ...report, appointmentCount: 0 }),
        of({ ...report, appointmentCount: 1 })
      );

      tester.detectChanges();

      tester.from.fillWith('');
      expect(tester.reportTitle).toBeNull();
      tester.from.dispatchEventOfType('blur');
      tester.to.fillWith('');
      expect(tester.reportTitle).toBeNull();
      tester.to.dispatchEventOfType('blur');

      expect(tester.errors.length).toBe(2);

      tester.from.fillWith('01/01/2021');
      expect(tester.reportTitle).toBeNull();
      tester.to.fillWith('31/01/2021');
      expect(tester.reportTitle).not.toBeNull();
      expect(tester.reportTitle).toContainText('1 rendez-vous');
    });
  });

  describe('with query params', () => {
    beforeEach(() => {
      const route = stubRoute({
        queryParams: {
          from: '2020-01-01',
          to: '2020-12-31'
        }
      });

      configureTestingModule(route);
      tester = new MediationStatisticsComponentTester();
    });

    it('should have populated form', () => {
      mediationStatisticsService.get.and.returnValue(
        of({ appointmentCount: 0 } as MediationReportModel)
      );

      tester.detectChanges();

      expect(tester.from).toHaveValue('01/01/2020');
      expect(tester.to).toHaveValue('31/12/2020');

      expect(mediationStatisticsService.get).toHaveBeenCalledWith('2020-01-01', '2020-12-31');
      expect(tester.reportTitle).toContainText('0 rendez-vous');
    });
  });
});

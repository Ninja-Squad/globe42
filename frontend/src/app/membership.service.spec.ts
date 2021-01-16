import { TestBed } from '@angular/core/testing';

import { MembershipService } from './membership.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { MembershipCommand } from './models/membership.command';
import { MembershipModel } from './models/membership.model';

describe('MembershipService', () => {
  let service: MembershipService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(MembershipService);
    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
  });

  it('should list memberships', () => {
    httpTester.testGet('/api/persons/42/memberships', [], service.list(42));
  });

  it('should get current membership', () => {
    httpTester.testGet(
      '/api/persons/42/memberships/current',
      {} as MembershipModel,
      service.getCurrent(42)
    );
  });

  it('should create current membership', () => {
    let current: MembershipModel = null;
    service.currentMembership$.subscribe(m => (current = m));

    const command: MembershipCommand = {
      year: 2018,
      paymentMode: 'CASH',
      paymentDate: '2018-01-31',
      cardNumber: '002'
    };
    const createdMembership = {} as MembershipModel;
    httpTester.testPost(
      '/api/persons/42/memberships',
      command,
      createdMembership,
      service.createCurrent(42, command)
    );
    expect(current).toBe(createdMembership);
  });

  it('should delete current membership', () => {
    let current: MembershipModel = {} as MembershipModel;
    service.currentMembership$.subscribe(m => (current = m));

    httpTester.testDelete('/api/persons/42/memberships/54', service.deleteCurrent(42, 54));
    expect(current).toBeNull();
  });

  it('should create old membership', () => {
    let current: MembershipModel = null;
    service.currentMembership$.subscribe(m => (current = m));

    const command: MembershipCommand = {
      year: 2018,
      paymentMode: 'CASH',
      paymentDate: '2018-01-31',
      cardNumber: '002'
    };
    const createdMembership = {} as MembershipModel;
    httpTester.testPost(
      '/api/persons/42/memberships',
      command,
      createdMembership,
      service.createOld(42, command)
    );
    expect(current).toBeNull();
  });

  it('should delete old membership', () => {
    let current: MembershipModel = {} as MembershipModel;
    service.currentMembership$.subscribe(m => (current = m));

    httpTester.testDelete('/api/persons/42/memberships/54', service.deleteOld(42, 54));
    expect(current).not.toBeNull();
  });
});

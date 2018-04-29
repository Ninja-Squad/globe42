import { TestBed } from '@angular/core/testing';

import { MembershipService } from './membership.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { MembershipCommand } from './models/membership.command';

describe('MembershipService', () => {

  let service: MembershipService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MembershipService],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.get(MembershipService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should list memberships', () => {
    httpTester.testGet('/api/persons/42/memberships', [], service.list(42));
  });

  it('should get current membership', () => {
    httpTester.testGet('/api/persons/42/memberships/current', {}, service.getCurrent(42));
  });

  it('should create current membership', () => {
    const command: MembershipCommand = {
      year: 2018,
      paymentMode: 'CASH',
      paymentDate: '2018-01-31',
      cardNumber: '002'
    };
    httpTester.testPost('/api/persons/42/memberships', command, {}, service.createCurrent(42, command));
  });

  it('should delete current membership', () => {
    httpTester.testDelete('/api/persons/42/memberships/54', service.deleteCurrent(42, 54));
  });
});

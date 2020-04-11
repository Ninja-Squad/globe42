import { TestBed } from '@angular/core/testing';

import { NetworkMemberService } from './network-member.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { NetworkMemberModel } from './models/network-member.model';
import { NetworkMemberCommand } from './models/network-member.command';

describe('NetworkMemberService', () => {
  let httpTester: HttpTester;
  let service: NetworkMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTester = new HttpTester(TestBed.inject(HttpTestingController));
    service = TestBed.inject(NetworkMemberService);
  });

  it('should list network members of a person', () => {
    httpTester.testGet(
      '/api/persons/42/network-members',
      [] as Array<NetworkMemberModel>,
      service.list(42)
    );
  });

  it('should create a network member for a person', () => {
    const command = {} as NetworkMemberCommand;
    httpTester.testPost(
      '/api/persons/42/network-members',
      command,
      {} as NetworkMemberModel,
      service.create(42, command)
    );
  });

  it('should update a network member of a person', () => {
    const command = {} as NetworkMemberCommand;
    httpTester.testPut(
      '/api/persons/42/network-members/56',
      command,
      service.update(42, 56, command)
    );
  });

  it('should delete a network member of a person', () => {
    httpTester.testDelete('/api/persons/42/network-members/56', service.delete(42, 56));
  });
});

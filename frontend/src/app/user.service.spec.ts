import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';
import { HttpTester } from './http-tester.spec';

describe('UserService', () => {

  let service: UserService;
  let http: HttpTestingController;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.get(UserService);
    http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
  });

  it('should get a user', () => {
    const expectedUser = { id: 1 } as UserModel;
    httpTester.testGet('/api/users/1', expectedUser, service.get(1));
  });

  it('should update a user', () => {
    const command = { login: 'jb' } as UserCommand;
    httpTester.testPut('/api/users/2', command, service.update(2, command));
  });

  it('should create a user', () => {
    const command = { login: 'jb' } as UserCommand;
    const expectedUser = { id: 2 } as UserWithPasswordModel;
    httpTester.testPost('/api/users', command, expectedUser, service.create(command));
  });

  it('should list users', () => {
    const expectedUsers = [{ id: 1 }] as Array<UserModel>;
    httpTester.testGet('/api/users', expectedUsers, service.list());
  });

  it('should delete a user', () => {
    httpTester.testDelete('/api/users/2', service.delete(2));
  });

  it('should reset a user password', () => {
    const expectedUser = { id: 2 } as UserWithPasswordModel;
    httpTester.testPost('/api/users/2/password-resets', null, expectedUser, service.resetPassword(2));
  });
});

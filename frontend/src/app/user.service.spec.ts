import { async, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { UserService } from './user.service';
import { UserModel } from './models/user.model';

describe('UserService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      { provide: Http, useFactory: (backend, options) => new Http(backend, options), deps: [MockBackend, BaseRequestOptions] },
      UserService
    ]
  }));

  it('should get a user', async(() => {
    const service: UserService = TestBed.get(UserService);
    const fakeUser: UserModel = { id: 1 } as UserModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons/1`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeUser })));
    });

    service.get(1)
      .subscribe(user => expect(user).toBe(fakeUser));
  }));

  it('should update a user', async(() => {
    const service: UserService = TestBed.get(UserService);
    const fakeUser: UserModel = { id: 2 } as UserModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons/2`);
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakeUser);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeUser })));
    });

    service.update(fakeUser)
      .subscribe(() => {});
  }));

  it('should create a user', async(() => {
    const service: UserService = TestBed.get(UserService);
    const fakeUser: UserModel = { id: 1 } as UserModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons`);
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakeUser);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakeUser })));
    });

    service.create(fakeUser)
      .subscribe(user => expect(user).toBe(fakeUser));
  }));

  it('should list users', async(() => {
    const service: UserService = TestBed.get(UserService);
    const fakeUser: UserModel = { id: 1 } as UserModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: [fakeUser] })));
    });

    service.list()
      .subscribe(users => expect(users).toEqual([fakeUser]));
  }));
});

import { async, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { PersonService } from './person.service';
import { PersonModel } from './models/person.model';

describe('PersonService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      { provide: Http, useFactory: (backend, options) => new Http(backend, options), deps: [MockBackend, BaseRequestOptions] },
      PersonService
    ]
  }));

  it('should get a person', async(() => {
    const service: PersonService = TestBed.get(PersonService);
    const fakePerson: PersonModel = { id: 1 } as PersonModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons/1`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakePerson })));
    });

    service.get(1)
      .subscribe(person => expect(person).toBe(fakePerson));
  }));

  it('should update a person', async(() => {
    const service: PersonService = TestBed.get(PersonService);
    const fakePerson: PersonModel = { id: 2 } as PersonModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons/2`);
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakePerson);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakePerson })));
    });

    service.update(fakePerson)
      .subscribe(() => {});
  }));

  it('should create a person', async(() => {
    const service: PersonService = TestBed.get(PersonService);
    const fakePerson: PersonModel = { id: 1 } as PersonModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons`);
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(JSON.parse(connection.request.getBody())).toEqual(fakePerson);
      connection.mockRespond(new Response(new ResponseOptions({ body: fakePerson })));
    });

    service.create(fakePerson)
      .subscribe(person => expect(person).toBe(fakePerson));
  }));

  it('should list persons', async(() => {
    const service: PersonService = TestBed.get(PersonService);
    const fakePerson: PersonModel = { id: 1 } as PersonModel;

    const mockBackend: MockBackend = TestBed.get(MockBackend);
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`/api/persons`);
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(new Response(new ResponseOptions({ body: [fakePerson] })));
    });

    service.list()
      .subscribe(persons => expect(persons).toEqual([fakePerson]));
  }));
});

import { TestBed } from '@angular/core/testing';

import { WeddingEventService } from './wedding-event.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpTester } from './http-tester.spec';
import { WeddingEventModel } from './models/wedding-event.model';
import { WeddingEventCommand } from './models/wedding-event.command';

describe('WeddingEventService', () => {
  let service: WeddingEventService;
  let httpTester: HttpTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(WeddingEventService);
    httpTester = new HttpTester(TestBed.get(HttpTestingController));
  });

  it('should list wedding events of a person', () => {
    const expectedEvents = [{ id: 42 }] as Array<WeddingEventModel>;
    httpTester.testGet('/api/persons/1/wedding-events', expectedEvents, service.list(1));
  });

  it('should create wedding event', () => {
    const expectedEvent: WeddingEventModel = { id: 42, date: '2018-03-20', type: 'DIVORCE', location: 'FRANCE' };
    const command: WeddingEventCommand = { date: '2018-03-20', type: 'DIVORCE', location: 'FRANCE' };
    httpTester.testPost(
      '/api/persons/1/wedding-events',
      command,
      expectedEvent,
      service.create(1, command));
  });

  it('should delete wedding event', () => {
    httpTester.testDelete('/api/persons/1/wedding-events/42', service.delete(1, 42));
  });
});

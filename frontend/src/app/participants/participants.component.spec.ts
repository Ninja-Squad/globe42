import { TestBed } from '@angular/core/testing';

import { ParticipantsComponent } from './participants.component';
import { FullnamePipe } from '../fullname.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ParticipantModel } from '../models/participant.model';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class ParticipantsComponentTester extends ComponentTester<ParticipantsComponent> {
  constructor() {
    super(ParticipantsComponent);
  }

  get title() {
    return this.element('h2');
  }

  get personItems() {
    return this.elements('.person-item');
  }
}

describe('ParticipantsComponent', () => {
  let tester: ParticipantsComponentTester;
  let dataSubject: BehaviorSubject<any>;
  let paramMapSubject: BehaviorSubject<ParamMap>;

  beforeEach(() => {
    dataSubject = new BehaviorSubject<any>(null);
    paramMapSubject = new BehaviorSubject<ParamMap>(null);

    const route = {
      data: dataSubject,
      paramMap: paramMapSubject
    };

    TestBed.configureTestingModule({
      declarations: [ParticipantsComponent, FullnamePipe, PageTitleDirective],
      imports: [RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: route }]
    });

    tester = new ParticipantsComponentTester();
  });

  it('should expose activity type and sorted participants', () => {
    const participants = [
      { id: 42, firstName: 'JB', lastName: 'Nizet' },
      { id: 43, firstName: 'Agnès', lastName: 'Crepet' }
    ] as Array<ParticipantModel>;

    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType: 'MEAL' }));

    tester.detectChanges();

    expect(tester.componentInstance.participants.map(p => p.firstName)).toEqual(['Agnès', 'JB']);
    expect(tester.componentInstance.activityType.key).toBe('MEAL');
  });

  it('should have a title', () => {
    const participants = [] as Array<ParticipantModel>;
    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType: 'MEAL' }));

    tester.detectChanges();
    expect(tester.title).toContainText('Participants aux activités de type Repas');
  });

  it('should display links, mediation code, email and phone', () => {
    const participants = [
      { id: 42, firstName: 'JB', lastName: 'Nizet' },
      {
        id: 43,
        firstName: 'Agnès',
        lastName: 'Crepet',
        mediationCode: 'C1',
        email: 'agnes@mail.com',
        phoneNumber: '0987654321'
      }
    ] as Array<ParticipantModel>;

    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType: 'MEAL' }));

    tester.detectChanges();

    expect(tester.personItems.length).toBe(2);
    expect(tester.personItems[0].element('a')).toHaveText('Agnès Crepet');
    expect(tester.personItems[0]).toContainText('C1');
    expect(tester.personItems[0]).toContainText('agnes@mail.com');
    expect(tester.personItems[0]).toContainText('0987654321');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsComponent } from './participants.component';
import { FullnamePipe } from '../fullname.pipe';
import { DisplayActivityTypePipe } from '../display-activity-type.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { PersonIdentityModel } from '../models/person.model';
import { Subject } from 'rxjs/Subject';

describe('ParticipantsComponent', () => {
  let component: ParticipantsComponent;
  let fixture: ComponentFixture<ParticipantsComponent>;
  let dataSubject: Subject<any>;
  let paramMapSubject: Subject<ParamMap>;

  beforeEach(() => {
    dataSubject = new Subject<any>();
    paramMapSubject = new Subject<ParamMap>();

    const route = {
      data: dataSubject,
      paramMap: paramMapSubject
    };

    TestBed.configureTestingModule({
      declarations: [ ParticipantsComponent, FullnamePipe, DisplayActivityTypePipe ],
      imports: [ RouterTestingModule ],
      providers: [
        FullnamePipe,
        { provide: ActivatedRoute, useValue: route }
      ]
    });

    fixture = TestBed.createComponent(ParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose activity type and sorted participants', () => {
    const participants = [
      { id: 42, firstName: 'JB', lastName: 'Nizet'},
      { id: 43, firstName: 'Agnès', lastName: 'Crepet' }
    ] as Array<PersonIdentityModel>;

    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType : 'MEAL' }));

    expect(component.participants.map(p => p.firstName)).toEqual(['Agnès', 'JB']);
    expect(component.activityType).toBe('MEAL');
  });

  it('should have a title', () => {
    const participants = [] as Array<PersonIdentityModel>;
    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType : 'MEAL' }));

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Participants aux activités de type Repas');
  });

  it('should display links and mediation code', () => {
    const participants = [
      { id: 42, firstName: 'JB', lastName: 'Nizet'},
      { id: 43, firstName: 'Agnès', lastName: 'Crepet', mediationCode: 'C1' }
    ] as Array<PersonIdentityModel>;

    dataSubject.next({ participants });
    paramMapSubject.next(convertToParamMap({ activityType : 'MEAL' }));

    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('.person-item');

    expect(divs.length).toBe(2);
    expect(divs[0].querySelector('a').textContent).toBe('Agnès Crepet');
    expect(divs[0].textContent).toContain('C1');
  });
});

import {
  ParticipationItem,
  PersonParticipationsComponent
} from './person-participations.component';
import { ParticipationModel } from '../models/participation.model';
import { PersonModel } from '../models/person.model';
import { ParticipationService } from '../participation.service';
import { ActivatedRoute } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FullnamePipe } from '../fullname.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { CurrentPersonService } from '../current-person.service';
import { ComponentTester, stubRoute } from 'ngx-speculoos';
import { ACTIVITY_TYPES, activityType, ActivityType } from '../models/activity-type.model';

class PersonParticipationsComponentTester extends ComponentTester<PersonParticipationsComponent> {
  constructor() {
    super(PersonParticipationsComponent);
  }

  get message() {
    return this.element('#message');
  }

  get checkboxes() {
    return this.elements('input');
  }

  checkboxForActivityType(type: ActivityType) {
    return this.input(`#activityType-${type}`);
  }
}

describe('PersonParticipationsComponent', () => {
  let participations: Array<ParticipationModel>;
  let person: PersonModel;
  let route: ActivatedRoute;
  let currentPersonService: CurrentPersonService;

  beforeEach(() => {
    participations = [
      {
        id: 42,
        activityType: 'MEAL'
      }
    ];

    person = { id: 1, firstName: 'JB', lastName: 'Nizet' } as PersonModel;

    route = stubRoute({
      data: { participations }
    });
    currentPersonService = { snapshot: person } as CurrentPersonService;
  });

  describe('logic', () => {
    let component: PersonParticipationsComponent;
    const participationService = new ParticipationService(null);
    beforeEach(() => {
      component = new PersonParticipationsComponent(
        currentPersonService,
        route,
        participationService
      );
    });

    it('should initialize person and items', () => {
      expect(component.items.length).toBe(ACTIVITY_TYPES.length);
      expect(component.items.find(item => item.activityType.key === 'MEAL')).toEqual({
        id: 42,
        activityType: activityType('MEAL'),
        selected: true
      });
      expect(
        component.items.filter(item => item.activityType.key === 'SOCIAL_MEDIATION')[0]
      ).toEqual({
        id: undefined,
        activityType: activityType('SOCIAL_MEDIATION'),
        selected: false
      });

      expect(component.person).toBe(person);
    });

    it('should create a participation when item is selected', () => {
      const socialMediationItem: ParticipationItem = component.items.filter(
        item => item.activityType.key === 'SOCIAL_MEDIATION'
      )[0];

      const participation = { id: 22 } as ParticipationModel;
      spyOn(participationService, 'create').and.returnValue(of(participation));

      component.selectItem(socialMediationItem);

      expect(socialMediationItem.id).toBe(participation.id);
      expect(socialMediationItem.selected).toBe(true);
      expect(participationService.create).toHaveBeenCalledWith(person.id, 'SOCIAL_MEDIATION');
    });

    it('should switch back to unselected if creation fails', () => {
      const socialMediationItem: ParticipationItem = component.items.find(
        item => item.activityType.key === 'SOCIAL_MEDIATION'
      );

      spyOn(participationService, 'create').and.returnValue(throwError('error'));

      component.selectItem(socialMediationItem);

      expect(socialMediationItem.id).toBeFalsy();
      expect(socialMediationItem.selected).toBe(false);
      expect(participationService.create).toHaveBeenCalledWith(person.id, 'SOCIAL_MEDIATION');
    });

    it('should delete a participation when item is unselected', () => {
      const mealItem: ParticipationItem = component.items.find(
        item => item.activityType.key === 'MEAL'
      );
      const participationId = mealItem.id;
      spyOn(participationService, 'delete').and.returnValue(of(null));

      component.selectItem(mealItem);

      expect(mealItem.id).toBeFalsy();
      expect(mealItem.selected).toBe(false);
      expect(participationService.delete).toHaveBeenCalledWith(person.id, participationId);
    });

    it('should switch back to selected if deletion fails', () => {
      const mealItem: ParticipationItem = component.items.find(
        item => item.activityType.key === 'MEAL'
      );
      const participationId = mealItem.id;
      spyOn(participationService, 'delete').and.returnValue(throwError('error'));

      component.selectItem(mealItem);

      expect(mealItem.selected).toBe(true);
      expect(participationService.delete).toHaveBeenCalledWith(person.id, participationId);
    });
  });

  describe('UI', () => {
    let tester: PersonParticipationsComponentTester;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PersonParticipationsComponent, FullnamePipe, PageTitleDirective],
        imports: [HttpClientModule, RouterTestingModule],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      });

      currentPersonService = TestBed.inject(CurrentPersonService);
      spyOnProperty(currentPersonService, 'snapshot').and.returnValue(person);

      tester = new PersonParticipationsComponentTester();
      tester.detectChanges();
    });

    it('should have a message', () => {
      expect(tester.message).toHaveText(`JB Nizet participe aux types d'activités suivants\u00a0:`);
    });

    it('should have checkboxes', () => {
      expect(tester.checkboxes.length).toBe(tester.componentInstance.items.length);
      expect(tester.checkboxForActivityType('MEAL')).toBeChecked();
      expect(tester.checkboxForActivityType('HEALTH_WORKSHOP')).not.toBeChecked();
    });

    it('should trigger selection change', () => {
      spyOn(tester.componentInstance, 'selectItem');

      tester.checkboxForActivityType('MEAL').uncheck();

      const mealItem = tester.componentInstance.items.find(
        item => item.activityType.key === 'MEAL'
      );
      expect(tester.componentInstance.selectItem).toHaveBeenCalledWith(mealItem);
    });
  });
});

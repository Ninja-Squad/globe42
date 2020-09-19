import { TestBed } from '@angular/core/testing';

import { PersonPerUnitRevenueInformationEditComponent } from './person-per-unit-revenue-information-edit.component';
import { FullnamePipe } from '../fullname.pipe';
import { PerUnitRevenueInformationService } from '../per-unit-revenue-information.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { PerUnitRevenueInformationModel } from '../models/per-unit-revenue-information.model';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class PersonPerUnitRevenueInformationEditComponentTester extends ComponentTester<
  PersonPerUnitRevenueInformationEditComponent
> {
  constructor() {
    super(PersonPerUnitRevenueInformationEditComponent);
  }

  get adultLikeCount() {
    return this.input('#adultLikeCount');
  }

  get childCount() {
    return this.input('#childCount');
  }

  get monoParental() {
    return this.input('#monoParental');
  }

  get save() {
    return this.button('#save');
  }
}

describe('PersonPerUnitRevenueInformationEditComponent', () => {
  let route: ActivatedRoute;
  let tester: PersonPerUnitRevenueInformationEditComponentTester;

  beforeEach(() => {
    const mockPerUnitRevenueInformationService = jasmine.createSpyObj(
      'perUnitRevenueInformationService',
      ['update']
    );
    route = {
      snapshot: {
        data: {
          person: {
            id: 42,
            firstName: 'John',
            lastName: 'Doe'
          } as PersonModel,
          perUnitRevenueInformation: {
            adultLikeCount: 3,
            childCount: 2,
            monoParental: true
          } as PerUnitRevenueInformationModel
        }
      }
    } as any;

    TestBed.configureTestingModule({
      declarations: [
        PersonPerUnitRevenueInformationEditComponent,
        FullnamePipe,
        ValidationDefaultsComponent,
        PageTitleDirective
      ],
      providers: [
        {
          provide: PerUnitRevenueInformationService,
          useValue: mockPerUnitRevenueInformationService
        },
        { provide: ActivatedRoute, useFactory: () => route }
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, ValdemortModule]
    }).compileComponents();

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    tester = new PersonPerUnitRevenueInformationEditComponentTester();
  });

  it('should contain a filled form when person has info', () => {
    tester.detectChanges();
    expect(tester.componentInstance.infoGroup.value).toEqual({
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    });

    expect(tester.adultLikeCount).toHaveValue('3');
    expect(tester.childCount).toHaveValue('2');
    expect(tester.monoParental).toBeChecked();
  });

  it('should contain a filled form when person has no info', () => {
    route.snapshot.data.perUnitRevenueInformation = null;
    tester.detectChanges();

    expect(tester.componentInstance.infoGroup.value).toEqual({
      adultLikeCount: 1,
      childCount: 0,
      monoParental: false
    });

    expect(tester.adultLikeCount).toHaveValue('1');
    expect(tester.childCount).toHaveValue('0');
    expect(tester.monoParental).not.toBeChecked();
  });

  it('should save and redirect', () => {
    tester.detectChanges();

    const router: Router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const perUnitRevenueInformationService = TestBed.inject(PerUnitRevenueInformationService);
    (perUnitRevenueInformationService.update as jasmine.Spy).and.returnValue(of(undefined));

    tester.save.click();

    expect(perUnitRevenueInformationService.update).toHaveBeenCalledWith(42, {
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    });

    expect(router.navigate).toHaveBeenCalledWith(['/persons', 42, 'resources']);
  });

  it('should display errors and not save if invalid', () => {
    tester.detectChanges();

    tester.adultLikeCount.fillWith('0');
    tester.adultLikeCount.dispatchEventOfType('blur');

    expect(tester.testElement).toContainText(
      `Le nombre d'adultes ou équivalent doit être supérieur ou égal à 1`
    );

    tester.adultLikeCount.fillWith('');
    expect(tester.testElement).toContainText(`Le nombre d'adultes ou équivalent est obligatoire`);

    tester.childCount.fillWith('-1');
    tester.childCount.dispatchEventOfType('blur');

    expect(tester.testElement).toContainText(`Le nombre d'enfants doit être supérieur ou égal à 0`);

    tester.childCount.fillWith('');

    expect(tester.testElement).toContainText(`Le nombre d'enfants est obligatoire`);

    tester.save.click();

    const perUnitRevenueInformationService = TestBed.inject(PerUnitRevenueInformationService);
    expect(perUnitRevenueInformationService.update).not.toHaveBeenCalled();
  });
});

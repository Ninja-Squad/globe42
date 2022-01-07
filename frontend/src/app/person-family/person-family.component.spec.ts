import { SituationComponent } from './situation/situation.component';
import { TestBed } from '@angular/core/testing';
import { PersonFamilyComponent, Situation } from './person-family.component';
import { FamilyService } from '../family.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmService } from '../confirm.service';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { FamilyModel } from '../models/family.model';
import { By } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { CurrentPersonService } from '../current-person.service';
import { RelativeComponent } from './relative/relative.component';

class PersonFamilyComponentTester extends ComponentTester<PersonFamilyComponent> {
  constructor() {
    super(PersonFamilyComponent);
  }

  get noFamily() {
    return this.element('#no-family');
  }

  get family() {
    return this.element('#family');
  }

  get situationComponents(): Array<SituationComponent> {
    return this.debugElement
      .queryAll(By.directive(SituationComponent))
      .map(d => d.componentInstance);
  }

  get deleteButton() {
    return this.button('#delete');
  }
}

describe('PersonFamilyComponent', () => {
  let route: ActivatedRoute;
  let currentPersonService: CurrentPersonService;
  let tester: PersonFamilyComponentTester;

  beforeEach(() => {
    route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {}
      })
    });

    TestBed.configureTestingModule({
      declarations: [
        PersonFamilyComponent,
        SituationComponent,
        RelativeComponent,
        PageTitleDirective,
        FullnamePipe
      ],
      providers: [
        FamilyService,
        ConfirmService,
        { provide: ActivatedRoute, useFactory: () => route }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, GlobeNgbTestingModule]
    });

    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({
      id: 42,
      firstName: 'John',
      lastName: 'Doe'
    });

    tester = new PersonFamilyComponentTester();
  });

  it('should display no family message if no family', () => {
    route.snapshot.data.family = null;
    tester.detectChanges();

    expect(tester.componentInstance.family).toBeNull();
    expect(tester.componentInstance.france).toBeFalsy();
    expect(tester.componentInstance.abroad).toBeFalsy();
    expect(tester.componentInstance.person.id).toBe(42);

    expect(tester.noFamily).toContainText(`Pas d'information`);
    expect(tester.family).toBeNull();
  });

  it('should display family if family present', () => {
    const family = {
      spouseLocation: 'ABROAD',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'foreignerChild',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'CHILD',
          firstName: 'frenchChild',
          birthDate: null,
          location: 'FRANCE'
        },
        {
          type: 'BROTHER',
          firstName: 'foreignerBrother',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'BROTHER',
          firstName: 'frenchBrother',
          birthDate: null,
          location: 'FRANCE'
        },
        {
          type: 'SISTER',
          firstName: 'foreignerSister',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          type: 'SISTER',
          firstName: 'frenchSister',
          birthDate: null,
          location: 'FRANCE'
        }
      ]
    } as FamilyModel;
    route.snapshot.data.family = family;

    tester.detectChanges();

    expect(tester.componentInstance.family).toBe(family);
    expect(tester.componentInstance.france).toEqual({
      spousePresent: false,
      children: [
        {
          type: 'CHILD',
          firstName: 'frenchChild',
          birthDate: null,
          location: 'FRANCE'
        }
      ],
      brothers: [
        {
          type: 'BROTHER',
          firstName: 'frenchBrother',
          birthDate: null,
          location: 'FRANCE'
        }
      ],
      sisters: [
        {
          type: 'SISTER',
          firstName: 'frenchSister',
          birthDate: null,
          location: 'FRANCE'
        }
      ]
    } as Situation);
    expect(tester.componentInstance.abroad).toEqual({
      spousePresent: true,
      children: [
        {
          type: 'CHILD',
          firstName: 'foreignerChild',
          birthDate: null,
          location: 'ABROAD'
        }
      ],
      brothers: [
        {
          type: 'BROTHER',
          firstName: 'foreignerBrother',
          birthDate: null,
          location: 'ABROAD'
        }
      ],
      sisters: [
        {
          type: 'SISTER',
          firstName: 'foreignerSister',
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    } as Situation);

    expect(tester.noFamily).toBeNull();
    expect(tester.family).not.toBeNull();
    expect(tester.situationComponents.length).toBe(2);
    expect(tester.situationComponents[0].situation).toBe(tester.componentInstance.france);
    expect(tester.situationComponents[1].situation).toBe(tester.componentInstance.abroad);
  });

  it('should delete family after confirmation', () => {
    const family = {
      spouseLocation: 'ABROAD',
      relatives: []
    } as FamilyModel;
    route.snapshot.data.family = family;

    tester.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const familyService: FamilyService = TestBed.inject(FamilyService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(familyService, 'delete').and.returnValue(of(undefined));

    tester.deleteButton.click();

    expect(tester.componentInstance.family).toBeNull();
    expect(tester.componentInstance.france).toBeFalsy();
    expect(tester.componentInstance.abroad).toBeFalsy();

    expect(tester.noFamily).not.toBeNull();
    expect(tester.family).toBeNull();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(familyService.delete).toHaveBeenCalledWith(42);
  });

  it('should not delete family if no confirmation', () => {
    const family = {
      spouseLocation: 'ABROAD',
      relatives: []
    } as FamilyModel;
    route.snapshot.data.family = family;

    tester.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const familyService: FamilyService = TestBed.inject(FamilyService);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(familyService, 'delete').and.returnValue(of(undefined));

    tester.deleteButton.click();
    expect(tester.family).not.toBeNull();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(familyService.delete).not.toHaveBeenCalled();
  });
});

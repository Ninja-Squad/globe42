import { SituationComponent } from './situation/situation.component';
import { async, TestBed } from '@angular/core/testing';
import { PersonFamilyComponent, Situation } from './person-family.component';
import { FamilyService } from '../family.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmService } from '../confirm.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { FamilyModel } from '../models/family.model';
import { By } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { CurrentPersonService } from '../current-person.service';

describe('PersonFamilyComponent', () => {
  let route: ActivatedRoute;
  let currentPersonService: CurrentPersonService;

  beforeEach(async(() => {
    route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {
        }
      })
    });

    TestBed.configureTestingModule({
      declarations: [PersonFamilyComponent, SituationComponent, PageTitleDirective, FullnamePipe],
      providers: [
        FamilyService,
        ConfirmService,
        { provide: ActivatedRoute, useFactory: () => route }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        GlobeNgbModule.forRoot()
      ]
    });

    currentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({
      id: 42,
      firstName: 'John',
      lastName: 'Doe'
    });
  }));

  it('should display no family message if no family', () => {
    route.snapshot.data.family = null;
    const fixture = TestBed.createComponent(PersonFamilyComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.family).toBeNull();
    expect(component.france).toBeFalsy();
    expect(component.abroad).toBeFalsy();
    expect(component.person.id).toBe(42);

    expect(fixture.nativeElement.querySelector('#no-family').textContent).toContain(`Pas d'information`);
    expect(fixture.nativeElement.querySelector('#family')).toBeFalsy();
  });

  it('should display family if family present', () => {
    const family = {
      spouseLocation: 'ABROAD',
      children: [
        {
          firstName: 'foreigner',
          birthDate: null,
          location: 'ABROAD'
        },
        {
          firstName: 'french',
          birthDate: null,
          location: 'FRANCE'
        }
      ]
    } as FamilyModel;
    route.snapshot.data.family = family;

    const fixture = TestBed.createComponent(PersonFamilyComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.family).toBe(family);
    expect(component.france).toEqual({
      spousePresent: false,
      children: [
        {
          firstName: 'french',
          birthDate: null,
          location: 'FRANCE'
        }
      ]
    } as Situation);
    expect(component.abroad).toEqual({
      spousePresent: true,
      children: [
        {
          firstName: 'foreigner',
          birthDate: null,
          location: 'ABROAD'
        }
      ]
    } as Situation);

    expect(fixture.nativeElement.querySelector('#no-family')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('#family')).toBeTruthy();
    const situationComponents = fixture.debugElement.queryAll(By.directive(SituationComponent));
    expect(situationComponents.length).toBe(2);
    expect(situationComponents[0].componentInstance.situation).toBe(component.france);
    expect(situationComponents[1].componentInstance.situation).toBe(component.abroad);
  });

  it('should delete family after confirmation', () => {
    const family = {
      spouseLocation: 'ABROAD',
      children: []
    } as FamilyModel;
    route.snapshot.data.family = family;

    const fixture = TestBed.createComponent(PersonFamilyComponent);
    fixture.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const familyService: FamilyService = TestBed.inject(FamilyService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(familyService, 'delete').and.returnValue(of(undefined));

    fixture.nativeElement.querySelector('#delete').click();
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.family).toBeNull();
    expect(component.france).toBeFalsy();
    expect(component.abroad).toBeFalsy();

    expect(fixture.nativeElement.querySelector('#no-family')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#family')).toBeFalsy();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(familyService.delete).toHaveBeenCalledWith(42);
  });

  it('should not delete family if no confirmation', () => {
    const family = {
      spouseLocation: 'ABROAD',
      children: []
    } as FamilyModel;
    route.snapshot.data.family = family;

    const fixture = TestBed.createComponent(PersonFamilyComponent);
    fixture.detectChanges();

    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const familyService: FamilyService = TestBed.inject(FamilyService);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(familyService, 'delete').and.returnValue(of(undefined));

    fixture.nativeElement.querySelector('#delete').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#family')).toBeTruthy();

    expect(confirmService.confirm).toHaveBeenCalled();
    expect(familyService.delete).not.toHaveBeenCalled();
  });
});

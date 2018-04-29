import { async, TestBed } from '@angular/core/testing';

import { PersonPerUnitRevenueInformationEditComponent } from './person-per-unit-revenue-information-edit.component';
import { FullnamePipe } from '../fullname.pipe';
import { PerUnitRevenueInformationService } from '../per-unit-revenue-information.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { PerUnitRevenueInformationModel } from '../models/per-unit-revenue-information.model';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';

describe('PersonPerUnitRevenueInformationEditComponent', () => {
  let route: ActivatedRoute;

  beforeEach(async(() => {
    const mockPerUnitRevenueInformationService =
      jasmine.createSpyObj('perUnitRevenueInformationService', ['update']);
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
      ],
      providers: [
        { provide: PerUnitRevenueInformationService, useValue: mockPerUnitRevenueInformationService },
        { provide: ActivatedRoute, useFactory: () => route }
      ],
      imports: [ ReactiveFormsModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  it('should contain a filled form when person has info', () => {
    const fixture = TestBed.createComponent(PersonPerUnitRevenueInformationEditComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.infoGroup.value).toEqual({
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    });

    expect(fixture.nativeElement.querySelector('#adultLikeCount').value).toBe('3');
    expect(fixture.nativeElement.querySelector('#childCount').value).toBe('2');
    expect(fixture.nativeElement.querySelector('#monoParental').checked).toBe(true);
  });

  it('should contain a filled form when person has no info', () => {
    route.snapshot.data.perUnitRevenueInformation = null;
    const fixture = TestBed.createComponent(PersonPerUnitRevenueInformationEditComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.infoGroup.value).toEqual({
      adultLikeCount: 1,
      childCount: 0,
      monoParental: false
    });

    expect(fixture.nativeElement.querySelector('#adultLikeCount').value).toBe('1');
    expect(fixture.nativeElement.querySelector('#childCount').value).toBe('0');
    expect(fixture.nativeElement.querySelector('#monoParental').checked).toBe(false);
  });

  it('should save and redirect', () => {
    const fixture = TestBed.createComponent(PersonPerUnitRevenueInformationEditComponent);
    fixture.detectChanges();

    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const perUnitRevenueInformationService = TestBed.get(PerUnitRevenueInformationService);
    (perUnitRevenueInformationService.update as jasmine.Spy).and.returnValue(of(undefined));

    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#save');
    saveButton.click();
    fixture.detectChanges();

    expect(perUnitRevenueInformationService.update).toHaveBeenCalledWith(42, {
      adultLikeCount: 3,
      childCount: 2,
      monoParental: true
    });

    expect(router.navigate).toHaveBeenCalledWith(['/persons', 42, 'resources']);
  });

  it('should display errors and not save if invalid', () => {
    const fixture = TestBed.createComponent(PersonPerUnitRevenueInformationEditComponent);
    fixture.detectChanges();

    const adultLikeCount: HTMLInputElement = fixture.nativeElement.querySelector('#adultLikeCount');
    adultLikeCount.value = '0';
    adultLikeCount.dispatchEvent(new Event('change'));
    adultLikeCount.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Le nombre d\'adultes ou équivalent doit être au moins égal à 1');

    adultLikeCount.value = '';
    adultLikeCount.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Le nombre d\'adultes ou équivalent est obligatoire');

    const childCount: HTMLInputElement = fixture.nativeElement.querySelector('#childCount');
    childCount.value = '-1';
    childCount.dispatchEvent(new Event('change'));
    childCount.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Le nombre d\'enfants doit être au moins égal à 0');

    childCount.value = '';
    childCount.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Le nombre d\'enfants est obligatoire');

    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('#save');
    saveButton.click();
    fixture.detectChanges();

    const perUnitRevenueInformationService = TestBed.get(PerUnitRevenueInformationService);
    expect(perUnitRevenueInformationService.update).not.toHaveBeenCalled();
  });
});

import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FullnamePipe } from '../fullname.pipe';
import { FamilyService } from '../family.service';
import { PersonFamilyEditComponent } from './person-family-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { FamilyCommand } from '../models/family.command';
import { FamilyModel } from '../models/family.model';
import { of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class PersonFamilyEditComponentTester extends ComponentTester<PersonFamilyEditComponent> {
  constructor() {
    super(PersonFamilyEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get spouseInFrance() {
    return this.input('#spouseInFrance');
  }

  get spouseAbroad() {
    return this.input('#spouseAbroad');
  }

  get noSpouse() {
    return this.input('#noSpouse');
  }

  relativeFirstName(index: number) {
    return this.input(`#relativeFirstName${index}`);
  }

  relativeType(index: number) {
    return this.element(`#relativeType${index}`);
  }

  relativeBirthdate(index: number) {
    return this.input(`#relativeBirthDate${index}`);
  }

  relativeLocationFrance(index: number) {
    return this.input(`#relativeLocationFrance${index}`);
  }

  relativeLocationAbroad(index: number) {
    return this.input(`#relativeLocationAbroad${index}`);
  }

  removeRelativeButton(index: number) {
    return this.button(`#removeRelative${index}`);
  }

  get addChildButton() {
    return this.button('#add-child');
  }

  get addBrotherButton() {
    return this.button('#add-brother');
  }

  get addSisterButton() {
    return this.button('#add-sister');
  }

  get saveButton() {
    return this.button('#save');
  }
}

describe('PersonFamilyEditComponent', () => {
  let route: ActivatedRoute;
  let tester: PersonFamilyEditComponentTester;

  beforeEach(() => {
    route = {
      snapshot: {
        data: {
          person: {
            id: 42,
            firstName: 'John',
            lastName: 'Doe'
          } as PersonModel
        }
      }
    } as any;

    TestBed.configureTestingModule({
      declarations: [PersonFamilyEditComponent, FullnamePipe, PageTitleDirective],
      providers: [FamilyService, { provide: ActivatedRoute, useFactory: () => route }],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        GlobeNgbTestingModule
      ]
    });

    tester = new PersonFamilyEditComponentTester();
  });

  it('should display person full name in title', () => {
    route.snapshot.data.family = null;

    tester.detectChanges();

    expect(tester.componentInstance.person.id).toBe(42);
    expect(tester.title).toHaveText('Éditer la situation familiale de John Doe');
  });

  it('should have a form when no family', () => {
    route.snapshot.data.family = null;

    tester.detectChanges();

    expect(tester.componentInstance.familyForm.value).toEqual({
      spouseLocation: null,
      relatives: []
    } as FamilyCommand);

    expect(tester.spouseInFrance).not.toBeChecked();
    expect(tester.spouseAbroad).not.toBeChecked();
    expect(tester.noSpouse).toBeChecked();
  });

  it('should have a form when family is present', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    tester.detectChanges();

    expect(tester.componentInstance.familyForm.value).toEqual({
      spouseLocation: 'FRANCE',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyCommand);

    expect(tester.spouseInFrance).toBeChecked();
    expect(tester.spouseAbroad).not.toBeChecked();
    expect(tester.noSpouse).not.toBeChecked();
    expect(tester.relativeFirstName(0)).toHaveValue('John');
    expect(tester.relativeType(0)).toHaveText('Enfant');
    expect(tester.relativeBirthdate(0)).toHaveValue('30/11/2000');
    expect(tester.relativeLocationFrance(0)).not.toBeChecked();
    expect(tester.relativeLocationAbroad(0)).toBeChecked();
  });

  it('should add and remove relatives', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    tester.detectChanges();

    tester.addChildButton.click();

    expect(tester.componentInstance.relatives.length).toBe(2);
    expect(tester.relativeType(1)).toHaveText('Enfant');
    expect(tester.relativeBirthdate(1)).toHaveValue('');
    expect(tester.relativeLocationFrance(1)).toBeChecked();
    expect(tester.relativeLocationAbroad(1)).not.toBeChecked();

    tester.addBrotherButton.click();

    expect(tester.componentInstance.relatives.length).toBe(3);
    expect(tester.relativeType(2)).toHaveText('Frère');
    expect(tester.relativeBirthdate(2)).toHaveValue('');
    expect(tester.relativeLocationFrance(2)).toBeChecked();
    expect(tester.relativeLocationAbroad(2)).not.toBeChecked();

    tester.addSisterButton.click();

    expect(tester.componentInstance.relatives.length).toBe(4);
    expect(tester.relativeType(3)).toHaveText('Soeur');
    expect(tester.relativeBirthdate(3)).toHaveValue('');
    expect(tester.relativeLocationFrance(3)).toBeChecked();
    expect(tester.relativeLocationAbroad(3)).not.toBeChecked();

    tester.removeRelativeButton(0).click();

    expect(tester.componentInstance.relatives.length).toBe(3);
    expect(tester.relativeType(0)).toHaveText('Enfant');
    expect(tester.relativeBirthdate(0)).toHaveValue('');
    expect(tester.relativeLocationFrance(0)).toBeChecked();
    expect(tester.relativeLocationAbroad(0)).not.toBeChecked();
  });

  it('should save the family is present', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    tester.detectChanges();

    const familyService: FamilyService = TestBed.inject(FamilyService);
    spyOn(familyService, 'save').and.returnValue(of(undefined));
    const router: Router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    tester.saveButton.click();

    const command: FamilyCommand = {
      spouseLocation: 'FRANCE',
      relatives: [
        {
          type: 'CHILD',
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    expect(familyService.save).toHaveBeenCalledWith(42, command);
    expect(router.navigate).toHaveBeenCalledWith(['/persons', 42, 'family']);
  });
});

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

  childFirstName(index: number) {
    return this.input(`#childFirstName${index}`);
  }

  childBirthdate(index: number) {
    return this.input(`#childBirthDate${index}`);
  }

  childLocationFrance(index: number) {
    return this.input(`#childLocationFrance${index}`);
  }

  childLocationAbroad(index: number) {
    return this.input(`#childLocationAbroad${index}`);
  }

  removeChildButton(index: number) {
    return this.button(`#removeChild${index}`);
  }

  get addChildButton() {
    return this.button('#add-child');
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
      children: []
    } as FamilyCommand);

    expect(tester.spouseInFrance).not.toBeChecked();
    expect(tester.spouseAbroad).not.toBeChecked();
    expect(tester.noSpouse).toBeChecked();
  });

  it('should have a form when family is present', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    tester.detectChanges();

    expect(tester.componentInstance.familyForm.value).toEqual({
      spouseLocation: 'FRANCE',
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyCommand);

    expect(tester.spouseInFrance).toBeChecked();
    expect(tester.spouseAbroad).not.toBeChecked();
    expect(tester.noSpouse).not.toBeChecked();
    expect(tester.childFirstName(0)).toHaveValue('John');
    expect(tester.childBirthdate(0)).toHaveValue('30/11/2000');
    expect(tester.childLocationFrance(0)).not.toBeChecked();
    expect(tester.childLocationAbroad(0)).toBeChecked();
  });

  it('should add and remove child', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyModel;

    tester.detectChanges();

    tester.addChildButton.click();

    expect(tester.componentInstance.children.length).toBe(2);
    expect(tester.childBirthdate(1)).toHaveValue('');
    expect(tester.childLocationFrance(1)).toBeChecked();
    expect(tester.childLocationAbroad(1)).not.toBeChecked();

    tester.removeChildButton(0).click();

    expect(tester.componentInstance.children.length).toBe(1);
    expect(tester.childBirthdate(0)).toHaveValue('');
    expect(tester.childLocationFrance(0)).toBeChecked();
    expect(tester.childLocationAbroad(0)).not.toBeChecked();
  });

  it('should save the family is present', () => {
    route.snapshot.data.family = {
      spouseLocation: 'FRANCE',
      children: [
        {
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
      children: [
        {
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

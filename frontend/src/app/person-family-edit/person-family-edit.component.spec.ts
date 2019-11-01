import { PersonModel } from '../models/person.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FullnamePipe } from '../fullname.pipe';
import { FamilyService } from '../family.service';
import { PersonFamilyEditComponent } from './person-family-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { FamilyCommand } from '../models/family.command';
import { FamilyModel } from '../models/family.model';
import { of } from 'rxjs';
import { PageTitleDirective } from '../page-title.directive';

describe('PersonFamilyEditComponent', () => {
  let route: ActivatedRoute;

  beforeEach(async(() => {
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
      providers: [
        FamilyService,
        { provide: ActivatedRoute, useFactory: () => route },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        GlobeNgbModule.forRoot()
      ]
    });
  }));

  it('should display person full name in title', () => {
    route.snapshot.data.family = null;

    const fixture = TestBed.createComponent(PersonFamilyEditComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.person.id).toBe(42);
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Éditer la situation familiale de John Doe');
  });

  it('should have a form when no family', () => {
    route.snapshot.data.family = null;

    const fixture = TestBed.createComponent(PersonFamilyEditComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.familyForm.value).toEqual({
      spouseLocation: null,
      children: []
    } as FamilyCommand);

    const element: HTMLElement = fixture.nativeElement;
    expect((element.querySelector('#spouseInFrance') as HTMLInputElement).checked).toBe(false);
    expect((element.querySelector('#spouseAbroad') as HTMLInputElement).checked).toBe(false);
    expect((element.querySelector('#noSpouse') as HTMLInputElement).checked).toBe(true);
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

    const fixture = TestBed.createComponent(PersonFamilyEditComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.familyForm.value).toEqual({
      spouseLocation: 'FRANCE',
      children: [
        {
          firstName: 'John',
          birthDate: '2000-11-30',
          location: 'ABROAD'
        }
      ]
    } as FamilyCommand);

    const element: HTMLElement = fixture.nativeElement;
    expect((element.querySelector('#spouseInFrance') as HTMLInputElement).checked).toBe(true);
    expect((element.querySelector('#spouseAbroad') as HTMLInputElement).checked).toBe(false);
    expect((element.querySelector('#noSpouse') as HTMLInputElement).checked).toBe(false);
    expect((element.querySelector('#childFirstName0') as HTMLInputElement).value).toBe('John');
    expect((element.querySelector('#childBirthDate0') as HTMLInputElement).value).toBe('30/11/2000');
    expect((element.querySelector('#childLocationFrance0') as HTMLInputElement).checked).toBe(false);
    expect((element.querySelector('#childLocationAbroad0') as HTMLInputElement).checked).toBe(true);
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

    const fixture = TestBed.createComponent(PersonFamilyEditComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    (element.querySelector('#add-child') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.children.length).toBe(2);
    expect((element.querySelector('#childBirthDate1') as HTMLInputElement).value).toBe('');
    expect((element.querySelector('#childLocationFrance1') as HTMLInputElement).checked).toBe(true);
    expect((element.querySelector('#childLocationAbroad1') as HTMLInputElement).checked).toBe(false);

    (element.querySelector('#removeChild0') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.children.length).toBe(1);
    expect((element.querySelector('#childBirthDate0') as HTMLInputElement).value).toBe('');
    expect((element.querySelector('#childLocationFrance0') as HTMLInputElement).checked).toBe(true);
    expect((element.querySelector('#childLocationAbroad0') as HTMLInputElement).checked).toBe(false);
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

    const fixture = TestBed.createComponent(PersonFamilyEditComponent);
    fixture.detectChanges();

    const familyService: FamilyService = TestBed.inject(FamilyService);
    spyOn(familyService, 'save').and.returnValue(of(undefined));
    const router: Router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const element: HTMLElement = fixture.nativeElement;
    (element.querySelector('#save') as HTMLButtonElement).click();
    fixture.detectChanges();

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

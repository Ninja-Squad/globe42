import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonNetworkMembersComponent } from './person-network-members.component';
import { ActivatedRoute } from '@angular/router';
import { NetworkMemberModel } from '../models/network-member.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplayNetworkMemberTypePipe } from '../display-network-member-type.pipe';
import { ConfirmService } from '../confirm.service';
import { NetworkMemberService } from '../network-member.service';
import { of, throwError } from 'rxjs';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';

describe('PersonNetworkMembersComponent', () => {

  let component: PersonNetworkMembersComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<PersonNetworkMembersComponent>;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    const member1: NetworkMemberModel = {
      id: 42,
      type: 'DOCTOR',
      text: 'Dr. No'
    };

    const member2: NetworkMemberModel = {
      id: 43,
      type: 'LAWYER',
      text: 'Dr. Yes'
    };

    route = {
      snapshot: {
        data: {
          members: [ member1, member2 ]
        },
        parent: {
          data: {
            person: {
              id: 1
            }
          }
        }
      }
    } as any;

    TestBed.configureTestingModule({
      declarations: [
        PersonNetworkMembersComponent,
        DisplayNetworkMemberTypePipe,
        ValidationDefaultsComponent,
        PageTitleDirective,
        FullnamePipe
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        GlobeNgbModule.forRoot(),
        ValdemortModule
      ]
    });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

    fixture = TestBed.createComponent(PersonNetworkMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  }));

  it('should display a list of members, and no form', () => {
    expect(component.editedMember).toBeFalsy();
    expect(component.memberForm).toBeFalsy();
    expect(component.members.length).toBe(2);
    expect(component.person.id).toBe(1);

    expect(element.querySelector('form')).toBeFalsy();
    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(2);
    expect(memberItems[0].textContent).toContain('Médecin');
    expect(memberItems[0].textContent).toContain('Dr. No');
  });

  it('should delete a member and reload list after confirmation', () => {
    const confirmService: ConfirmService = TestBed.get(ConfirmService);
    const networkMemberService: NetworkMemberService = TestBed.get(NetworkMemberService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(networkMemberService, 'delete').and.returnValue(of(undefined));
    spyOn(networkMemberService, 'list').and.returnValue(of([
      {
        id: 42,
        type: 'DOCTOR',
        text: 'Dr. No no no'
      }
    ]));

    const secondDeleteButton = element.querySelectorAll('.member-item .delete')[1] as HTMLButtonElement;
    secondDeleteButton.click();

    fixture.detectChanges();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(1);
    expect(memberItems[0].textContent).toContain('Dr. No no no');
  });

  it('should not delete a member and reload list if not confirmed', () => {
    const confirmService: ConfirmService = TestBed.get(ConfirmService);
    const networkMemberService: NetworkMemberService = TestBed.get(NetworkMemberService);

    spyOn(confirmService, 'confirm').and.returnValue(throwError(undefined));
    spyOn(networkMemberService, 'delete');
    spyOn(networkMemberService, 'list');

    const secondDeleteButton = element.querySelectorAll('.member-item .delete')[1] as HTMLButtonElement;
    secondDeleteButton.click();

    fixture.detectChanges();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(2);

    expect(networkMemberService.delete).not.toHaveBeenCalled();
    expect(networkMemberService.list).not.toHaveBeenCalled();
  });

  it('should create an empty form when asking to create a new network member', () => {
    const createButton = element.querySelector('#newMemberButton') as HTMLButtonElement;
    createButton.click();
    fixture.detectChanges();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(0); // hide the list while creating

    expect(component.editedMember).toBeFalsy();
    expect(component.memberForm).toBeTruthy();

    const typeSelect = element.querySelector('#type') as HTMLSelectElement;
    expect(typeSelect.selectedIndex).toBeLessThan(1); // 0 on Safari, -1 on good browsers
    expect(typeSelect.options[0].textContent).toBe('');
    expect(typeSelect.options[1].textContent).toBe('Médecin');

    const textArea = element.querySelector('#text') as HTMLTextAreaElement;
    expect(textArea.value).toBe('');
  });

  it('should hide the form and re-display the list when cancelling', () => {
    const createButton = element.querySelector('#newMemberButton') as HTMLButtonElement;
    createButton.click();
    fixture.detectChanges();

    const cancelButton = element.querySelector('#cancelEditionButton') as HTMLButtonElement;
    cancelButton.click();
    fixture.detectChanges();

    expect(component.editedMember).toBeFalsy();
    expect(component.memberForm).toBeFalsy();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(2);
  });

  it('should validate the form', () => {
    const createButton = element.querySelector('#newMemberButton') as HTMLButtonElement;
    createButton.click();
    fixture.detectChanges();

    const networkMemberService: NetworkMemberService = TestBed.get(NetworkMemberService);
    spyOn(networkMemberService, 'create');

    const form = element.querySelector('form');

    expect(form.textContent).not.toContain('Le type est obligatoire');
    expect(form.textContent).not.toContain('Le texte est obligatoire');

    const saveButton = element.querySelector('#saveButton') as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    expect(networkMemberService.create).not.toHaveBeenCalled();

    expect(form.textContent).toContain('Le type est obligatoire');
    expect(form.textContent).toContain('Le texte est obligatoire');
  });

  it('should create and reload the list', () => {
    const networkMemberService: NetworkMemberService = TestBed.get(NetworkMemberService);
    spyOn(networkMemberService, 'create').and.returnValue(of({} as NetworkMemberModel));
    spyOn(networkMemberService, 'list').and.returnValue(of([
      component.members[0],
      component.members[1],
      {
        id: 44,
        type: 'PERSON_TO_WARN',
        text: 'Mummy'
      }
    ]));

    const createButton = element.querySelector('#newMemberButton') as HTMLButtonElement;
    createButton.click();
    fixture.detectChanges();

    const typeSelect = element.querySelector('#type') as HTMLSelectElement;
    typeSelect.selectedIndex = 3;
    typeSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const textArea = element.querySelector('#text') as HTMLTextAreaElement;
    textArea.value = 'Mummy';
    textArea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const saveButton = element.querySelector('#saveButton') as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    expect(component.editedMember).toBeFalsy();
    expect(component.memberForm).toBeFalsy();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(3);
    expect(networkMemberService.create).toHaveBeenCalledWith(1, {
      type: 'PERSON_TO_WARN',
      text: 'Mummy'
    });
  });

  it('should create a populated form when asking to edit a network member, and save', () => {
    const firstEditButton = element.querySelector('.edit') as HTMLButtonElement;
    firstEditButton.click();
    fixture.detectChanges();

    const memberItems = element.querySelectorAll('.member-item');
    expect(memberItems.length).toBe(0); // hide the list while updating

    expect(component.editedMember).toBe(component.members[0]);
    expect(component.memberForm).toBeTruthy();

    const typeSelect = element.querySelector('#type') as HTMLSelectElement;
    expect(typeSelect.selectedIndex).toBe(1);
    typeSelect.selectedIndex = 0;
    typeSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const textArea = element.querySelector('#text') as HTMLTextAreaElement;
    expect(textArea.value).toBe('Dr. No');

    const networkMemberService: NetworkMemberService = TestBed.get(NetworkMemberService);
    spyOn(networkMemberService, 'update').and.returnValue(of(undefined));
    spyOn(networkMemberService, 'list').and.returnValue(of(component.members));

    const saveButton = element.querySelector('#saveButton') as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    expect(element.textContent).toContain('Le type est obligatoire');
    typeSelect.selectedIndex = 2;
    typeSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Le type est obligatoire');

    saveButton.click();
    fixture.detectChanges();

    expect(component.editedMember).toBeFalsy();
    expect(component.memberForm).toBeFalsy();
    expect(networkMemberService.update).toHaveBeenCalledWith(1, 42, {
      type: 'LAWYER',
      text: 'Dr. No'
    });
  });
});

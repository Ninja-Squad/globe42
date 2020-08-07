import { TestBed } from '@angular/core/testing';

import { PersonNetworkMembersComponent } from './person-network-members.component';
import { ActivatedRoute } from '@angular/router';
import { NetworkMemberModel } from '../models/network-member.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplayNetworkMemberTypePipe } from '../display-network-member-type.pipe';
import { ConfirmService } from '../confirm.service';
import { NetworkMemberService } from '../network-member.service';
import { EMPTY, of } from 'rxjs';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { FullnamePipe } from '../fullname.pipe';
import { CurrentPersonService } from '../current-person.service';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';

class PersonNetworlMembersComponentTester extends ComponentTester<PersonNetworkMembersComponent> {
  constructor() {
    super(PersonNetworkMembersComponent);
  }

  get form() {
    return this.element('form');
  }

  get memberItems() {
    return this.elements('.member-item');
  }

  get deleteButtons() {
    return this.elements<HTMLButtonElement>('.member-item .delete');
  }

  get newMemberButton() {
    return this.button('#newMemberButton');
  }

  get type() {
    return this.select('#type');
  }

  get text() {
    return this.textarea('#text');
  }

  get cancelEditionButton() {
    return this.button('#cancelEditionButton');
  }

  get saveButton() {
    return this.button('#saveButton');
  }

  get editButtons() {
    return this.elements<HTMLButtonElement>('.edit');
  }
}

describe('PersonNetworkMembersComponent', () => {
  let tester: PersonNetworlMembersComponentTester;
  let route: ActivatedRoute;

  beforeEach(() => {
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

    route = fakeRoute({
      snapshot: fakeSnapshot({
        data: {
          members: [member1, member2]
        }
      })
    });

    TestBed.configureTestingModule({
      declarations: [
        PersonNetworkMembersComponent,
        DisplayNetworkMemberTypePipe,
        ValidationDefaultsComponent,
        PageTitleDirective,
        FullnamePipe
      ],
      providers: [{ provide: ActivatedRoute, useValue: route }],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        GlobeNgbTestingModule,
        ValdemortModule
      ]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 1 });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();

    tester = new PersonNetworlMembersComponentTester();
    tester.detectChanges();
  });

  it('should display a list of members, and no form', () => {
    expect(tester.componentInstance.editedMember).toBeFalsy();
    expect(tester.componentInstance.memberForm).toBeFalsy();
    expect(tester.componentInstance.members.length).toBe(2);
    expect(tester.componentInstance.person.id).toBe(1);

    expect(tester.form).toBeNull();
    expect(tester.memberItems.length).toBe(2);
    expect(tester.memberItems[0]).toContainText('Médecin');
    expect(tester.memberItems[0]).toContainText('Dr. No');
  });

  it('should delete a member and reload list after confirmation', () => {
    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const networkMemberService: NetworkMemberService = TestBed.inject(NetworkMemberService);

    spyOn(confirmService, 'confirm').and.returnValue(of(undefined));
    spyOn(networkMemberService, 'delete').and.returnValue(of(undefined));

    const members: Array<NetworkMemberModel> = [
      {
        id: 42,
        type: 'DOCTOR',
        text: 'Dr. No no no'
      }
    ];
    spyOn(networkMemberService, 'list').and.returnValue(of(members));

    tester.deleteButtons[1].click();

    expect(tester.memberItems.length).toBe(1);
    expect(tester.memberItems[0]).toContainText('Dr. No no no');
  });

  it('should not delete a member and reload list if not confirmed', () => {
    const confirmService: ConfirmService = TestBed.inject(ConfirmService);
    const networkMemberService: NetworkMemberService = TestBed.inject(NetworkMemberService);

    spyOn(confirmService, 'confirm').and.returnValue(EMPTY);
    spyOn(networkMemberService, 'delete');
    spyOn(networkMemberService, 'list');

    tester.deleteButtons[1].click();

    expect(tester.memberItems.length).toBe(2);

    expect(networkMemberService.delete).not.toHaveBeenCalled();
    expect(networkMemberService.list).not.toHaveBeenCalled();
  });

  it('should create an empty form when asking to create a new network member', () => {
    tester.newMemberButton.click();

    expect(tester.memberItems.length).toBe(0); // hide the list while creating

    expect(tester.componentInstance.editedMember).toBeFalsy();
    expect(tester.componentInstance.memberForm).toBeTruthy();

    expect(tester.type).toHaveSelectedLabel('');
    expect(tester.type.optionLabels[1]).toContain('Médecin');

    expect(tester.text).toHaveValue('');
  });

  it('should hide the form and re-display the list when cancelling', () => {
    tester.newMemberButton.click();

    tester.cancelEditionButton.click();

    expect(tester.componentInstance.editedMember).toBeFalsy();
    expect(tester.componentInstance.memberForm).toBeFalsy();

    expect(tester.memberItems.length).toBe(2);
  });

  it('should validate the form', () => {
    tester.newMemberButton.click();

    const networkMemberService: NetworkMemberService = TestBed.inject(NetworkMemberService);
    spyOn(networkMemberService, 'create');

    expect(tester.form).not.toContainText('Le type est obligatoire');
    expect(tester.form).not.toContainText('Le texte est obligatoire');

    tester.saveButton.click();

    expect(networkMemberService.create).not.toHaveBeenCalled();

    expect(tester.form).toContainText('Le type est obligatoire');
    expect(tester.form).toContainText('Le texte est obligatoire');
  });

  it('should create and reload the list', () => {
    const networkMemberService: NetworkMemberService = TestBed.inject(NetworkMemberService);
    spyOn(networkMemberService, 'create').and.returnValue(of({} as NetworkMemberModel));
    const members: Array<NetworkMemberModel> = [
      tester.componentInstance.members[0],
      tester.componentInstance.members[1],
      {
        id: 44,
        type: 'PERSON_TO_WARN',
        text: 'Mummy'
      }
    ];
    spyOn(networkMemberService, 'list').and.returnValue(of(members));

    tester.newMemberButton.click();

    tester.type.selectIndex(3);
    tester.text.fillWith('Mummy');
    tester.saveButton.click();

    expect(tester.componentInstance.editedMember).toBeFalsy();
    expect(tester.componentInstance.memberForm).toBeFalsy();

    expect(tester.memberItems.length).toBe(3);
    expect(networkMemberService.create).toHaveBeenCalledWith(1, {
      type: 'PERSON_TO_WARN',
      text: 'Mummy'
    });
  });

  it('should create a populated form when asking to edit a network member, and save', () => {
    tester.editButtons[0].click();

    expect(tester.memberItems.length).toBe(0); // hide the list while updating

    expect(tester.componentInstance.editedMember).toBe(tester.componentInstance.members[0]);
    expect(tester.componentInstance.memberForm).toBeTruthy();

    expect(tester.type).toHaveSelectedIndex(1);
    tester.type.selectIndex(0);

    expect(tester.text).toHaveValue('Dr. No');

    const networkMemberService: NetworkMemberService = TestBed.inject(NetworkMemberService);
    spyOn(networkMemberService, 'update').and.returnValue(of(undefined));
    spyOn(networkMemberService, 'list').and.returnValue(of(tester.componentInstance.members));

    tester.saveButton.click();

    expect(tester.testElement).toContainText('Le type est obligatoire');
    tester.type.selectIndex(2);
    expect(tester.testElement).not.toContainText('Le type est obligatoire');

    tester.saveButton.click();

    expect(tester.componentInstance.editedMember).toBeFalsy();
    expect(tester.componentInstance.memberForm).toBeFalsy();
    expect(networkMemberService.update).toHaveBeenCalledWith(1, 42, {
      type: 'LAWYER',
      text: 'Dr. No'
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ComponentTester, fakeRoute, fakeSnapshot } from 'ngx-speculoos';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileCommand, ProfileModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ValdemortModule } from 'ngx-valdemort';

class ProfileComponentTester extends ComponentTester<ProfileComponent> {
  constructor() {
    super(ProfileComponent);
  }

  get email() {
    return this.input('#email');
  }

  taskAssignmentEmailNotificationEnabled(yesOrNo: boolean) {
    return this.input(`#taskAssignmentEmailNotificationEnabled-${yesOrNo}`);
  }

  get save() {
    return this.button('#save');
  }
}

describe('ProfileComponent', () => {
  let tester: ProfileComponentTester;
  let profile: ProfileModel;
  let currentUserService: CurrentUserService;

  beforeEach(() => {
    profile = {
      login: 'joe',
      admin: true,
      email: 'joe@nowhere.com',
      taskAssignmentEmailNotificationEnabled: true
    } as ProfileModel;

    const route = fakeRoute({
      snapshot: fakeSnapshot({
        data: { profile }
      })
    });

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        GlobeNgbTestingModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ValdemortModule
      ],
      providers: [{ provide: ActivatedRoute, useFactory: () => route }]
    });

    currentUserService = TestBed.inject(CurrentUserService);

    tester = new ProfileComponentTester();
  });

  it('should display a message with login and admin', () => {
    tester.detectChanges();

    expect(tester.testElement).toContainText('Votre identifiant est joe.');
    expect(tester.testElement).toContainText(' Vous êtes administrateur/administratrice.');
  });

  it('should not display a message with admin if not admin', () => {
    tester.detectChanges();
    profile.admin = false;
    tester.detectChanges();

    expect(tester.testElement).not.toContainText(' Vous êtes administrateur/administratrice..');
  });

  it('should display a filled form', () => {
    tester.detectChanges();
    expect(tester.email).toHaveValue('joe@nowhere.com');
    expect(tester.taskAssignmentEmailNotificationEnabled(true)).toBeChecked();
    expect(tester.taskAssignmentEmailNotificationEnabled(false)).not.toBeChecked();
  });

  it('should not save if invalid', () => {
    tester.detectChanges();
    tester.email.fillWith('invalid');

    spyOn(currentUserService, 'updateProfile');
    tester.save.click();

    expect(currentUserService.updateProfile).not.toHaveBeenCalled();
  });

  it('should save if valid', () => {
    tester.detectChanges();
    tester.email.fillWith('joe@somewhere.com');
    tester.taskAssignmentEmailNotificationEnabled(false).click();

    spyOn(currentUserService, 'updateProfile').and.returnValue(of(undefined));
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    tester.save.click();

    const expectedCommand: ProfileCommand = {
      email: 'joe@somewhere.com',
      taskAssignmentEmailNotificationEnabled: false
    };
    expect(currentUserService.updateProfile).toHaveBeenCalledWith(expectedCommand);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});

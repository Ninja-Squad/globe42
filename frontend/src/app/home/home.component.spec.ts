import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { HomeComponent } from './home.component';
import { UserModel } from '../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { PageTitleDirective } from '../page-title.directive';
import { ComponentTester } from 'ngx-speculoos';

class HomeComponentTester extends ComponentTester<HomeComponent> {
  constructor() {
    super(HomeComponent);
  }

  get login() {
    return this.element<HTMLAnchorElement>('#login-link');
  }

  get personsLink() {
    return this.element<HTMLAnchorElement>('#persons-link');
  }

  get usersLink() {
    return this.element<HTMLAnchorElement>('#users-link');
  }
}

describe('HomeComponent', () => {
  let fakeUserService: CurrentUserService;
  let tester: HomeComponentTester;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientModule],
      declarations: [HomeComponent, PageTitleDirective]
    });

    fakeUserService = {
      userEvents: new BehaviorSubject<UserModel>(undefined)
    } as CurrentUserService;
    tester = new HomeComponentTester();
  });

  it('display a link to go the login', () => {
    tester.detectChanges();
    tester.componentInstance.user = null;
    tester.detectChanges();

    expect(tester.login).not.toBeNull();
    expect(tester.login).toContainText('Connexion');
    expect(tester.personsLink).toBeNull();
    expect(tester.usersLink).toBeNull();
  });

  it('should listen to userEvents in ngOnInit', () => {
    const component = new HomeComponent(fakeUserService);
    component.ngOnInit();

    const user = { login: 'cedric' } as UserModel;

    fakeUserService.userEvents.next(user);

    expect(component.user).toBe(user);
  });

  it('should unsubscribe on destroy', () => {
    const component = new HomeComponent(fakeUserService);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display link to go the persons page if logged in', () => {
    tester.detectChanges();
    tester.componentInstance.user = { login: 'cedric' } as UserModel;
    tester.detectChanges();

    expect(tester.login).toBeNull();
    expect(tester.personsLink).not.toBeNull();
    expect(tester.personsLink).toContainText('Gestion des adhérents');
    expect(tester.usersLink).toBeNull();
  });

  it('should display link to go the users page if admin', () => {
    tester.detectChanges();
    tester.componentInstance.user = { login: 'cedric', admin: true } as UserModel;
    tester.detectChanges();

    expect(tester.usersLink).not.toBeNull();
    expect(tester.usersLink).toContainText("Gestion des utilisateurs de l'application");
  });
});

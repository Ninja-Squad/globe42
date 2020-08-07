import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MenuComponent } from './menu.component';
import { UserModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';
import { GlobeNgbTestingModule } from '../globe-ngb/globe-ngb-testing.module';
import { ComponentTester } from 'ngx-speculoos';
import { Router } from '@angular/router';

class MenuComponentTester extends ComponentTester<MenuComponent> {
  constructor() {
    super(MenuComponent);
  }

  get navbar() {
    return this.element('#navbar');
  }

  get toggler() {
    return this.button('button');
  }

  get userDropDown() {
    return this.element<HTMLAnchorElement>('#userDropDown');
  }

  get changePasswordLink() {
    return this.element('a[href="/password-changes"]');
  }

  get usersLink() {
    return this.element('a[href="/users"]');
  }

  get logout() {
    return this.element<HTMLAnchorElement>('#menu-logout');
  }
}

describe('MenuComponent', () => {
  let fakeUserService: CurrentUserService;
  let fakeRouter: jasmine.SpyObj<Router>;
  let tester: MenuComponentTester;

  beforeEach(() => {
    fakeUserService = {
      userEvents: new BehaviorSubject<UserModel | null>(null),
      logout: () => {}
    } as CurrentUserService;
    fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, GlobeNgbTestingModule],
      declarations: [MenuComponent],
      providers: [{ provide: CurrentUserService, useValue: fakeUserService }]
    });

    tester = new MenuComponentTester();
  });

  it('should have a `navbarCollapsed` field', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService, fakeRouter);
    menu.ngOnInit();
    expect(menu.navbarCollapsed).toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService, fakeRouter);
    expect(menu.toggleNavbar).not.toBeNull();

    menu.toggleNavbar();

    expect(menu.navbarCollapsed).toBe(false);

    menu.toggleNavbar();

    expect(menu.navbarCollapsed).toBe(true);
  });

  it('should toggle the class on click', () => {
    tester.detectChanges();

    expect(tester.navbar).not.toBeNull();
    expect(tester.navbar).not.toHaveClass('show');

    expect(tester.toggler).not.toBeNull();
    tester.toggler.click();

    expect(tester.navbar).toHaveClass('show');
  });

  it('should listen to userEvents in ngOnInit', fakeAsync(() => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    component.ngOnInit();

    // emulate a login
    const user = { id: 1, login: 'cedric' } as UserModel;
    fakeUserService.userEvents.next(user);
    tick();

    expect(component.user).toBe(user);
    tick();

    // emulate a logout
    fakeUserService.userEvents.next(null);
    tick();

    expect(component.user).toBe(null);
  }));

  it('should display the user if logged', () => {
    tester.detectChanges();

    tester.componentInstance.user = { login: 'cedric' } as UserModel;

    tester.detectChanges();

    expect(tester.userDropDown).not.toBeNull();
    expect(tester.userDropDown).toContainText('cedric');
  });

  it('should navigate to the password change page', () => {
    tester.detectChanges();

    tester.componentInstance.user = { login: 'cedric' } as UserModel;

    tester.detectChanges();

    tester.userDropDown.click();

    expect(tester.changePasswordLink).not.toBeNull();
  });

  it('should navigate to the users page if admin', () => {
    tester.detectChanges();

    tester.componentInstance.user = { login: 'cedric', admin: true } as UserModel;

    tester.detectChanges();

    expect(tester.usersLink).not.toBeNull();
  });

  it('should unsubscribe on destroy', () => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display a logout button', () => {
    tester.detectChanges();
    tester.componentInstance.user = { login: 'cedric' } as UserModel;
    tester.detectChanges();
    spyOn(tester.componentInstance, 'logout').and.callFake(event => event.preventDefault());

    tester.userDropDown.click();
    expect(tester.logout).not.toBeNull();
    tester.logout.click();

    expect(tester.componentInstance.logout).toHaveBeenCalled();
  });

  it('should stop the click event propagation', () => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    const event = new Event('click');
    spyOn(fakeUserService, 'logout');
    spyOn(event, 'preventDefault');
    component.logout(event);

    expect(fakeUserService.logout).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MenuComponent } from './menu.component';
import { UserModel } from '../models/user.model';
import { CurrentUserService } from '../current-user/current-user.service';
import { GlobeNgbModule } from '../globe-ngb/globe-ngb.module';

describe('MenuComponent', () => {
  const fakeUserService = {
    userEvents: new BehaviorSubject<UserModel | null>(null),
    logout: () => {}
  } as CurrentUserService;
  const fakeRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, GlobeNgbModule],
      declarations: [MenuComponent],
      providers: [{ provide: CurrentUserService, useValue: fakeUserService }]
    })
  );

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
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed).not.toBeNull();
    expect(navbarCollapsed.classList).toContain('collapse');

    const button = element.querySelector('button');
    expect(button).not.toBeNull();
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList).not.toContain('collapse');
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
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric' } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('#userDropDown');
    expect(info).not.toBeNull();
    expect(info.textContent).toContain('cedric');
  });

  it('should navigate to the password change page', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric' } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('#userDropDown');
    info.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const changePasswordLink = element.querySelector('a[href="/password-changes"]');
    expect(changePasswordLink).not.toBeNull();
  });

  it('should navigate to the users page if admin', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric', admin: true } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const usersLink = element.querySelector('a[href="/users"]');
    expect(usersLink).not.toBeNull();
  });

  it('should unsubscribe on destroy', () => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display a logout button', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.user = { login: 'cedric' } as UserModel;
    fixture.detectChanges();
    spyOn(fixture.componentInstance, 'logout');

    const element = fixture.nativeElement;
    const logout = element.querySelector('span.fa-power-off');
    expect(logout).not.toBeNull();
    logout.dispatchEvent(new Event('click', { bubbles: true }));

    fixture.detectChanges();
    expect(fixture.componentInstance.logout).toHaveBeenCalled();
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

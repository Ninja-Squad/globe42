import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { HomeComponent } from './home.component';
import { UserModel } from '../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { CurrentUserModule } from '../current-user/current-user.module';
import { CurrentUserService } from '../current-user/current-user.service';
import { PageTitleDirective } from '../page-title.directive';

describe('HomeComponent', () => {
  const fakeUserService = {
    userEvents: new BehaviorSubject<UserModel>(undefined)
  } as CurrentUserService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), RouterTestingModule, HttpClientModule],
      declarations: [HomeComponent, PageTitleDirective]
    })
  );

  it('display a link to go the login', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.user = null;
    fixture.detectChanges();

    const button = element.querySelector('a[href="/login"]');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Connexion');
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
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    fixture.componentInstance.user = { login: 'cedric' } as UserModel;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/persons"]');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('Gestion des adhérents');
  });

  it('should display link to go the users page if admin', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    fixture.componentInstance.user = { login: 'cedric', admin: true } as UserModel;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/users"]');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain("Gestion des utilisateurs de l'application");
  });
});

import { TestBed } from '@angular/core/testing';

import { CurrentUserService } from './current-user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { HttpTester } from '../http-tester.spec';
import { CurrentUserModule } from './current-user.module';
import { ProfileCommand, ProfileModel, UserModel } from '../models/user.model';

describe('CurrentUserService', () => {
  let service: CurrentUserService;
  let http: HttpTestingController;
  let httpTester: HttpTester;
  let jwtInterceptor: JwtInterceptorService;
  const originalLocalStorage = window.localStorage;

  const mockLocalStorage = {
    setItem: (key: string, value: string) => {},
    getItem: (key: string) => null as string,
    removeItem: (key: string) => {}
  };

  const globeUser = {
    id: 1,
    login: 'cedric',
    admin: true,
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentUserModule.forRoot(), HttpClientTestingModule]
    });

    service = TestBed.inject(CurrentUserService);
    http = TestBed.inject(HttpTestingController);
    httpTester = new HttpTester(http);
    jwtInterceptor = TestBed.inject(JwtInterceptorService);
    // we use this instead of jasmine.spyOn to make it pass on Firefox
    // https://github.com/jasmine/jasmine/issues/299
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => Object.defineProperty(window, 'localStorage', { value: originalLocalStorage }));

  it('should authenticate a user', () => {
    const credentials = {login: 'cedric', password: 'hello'};

    // spy on the store method
    spyOn(service, 'storeLoggedInUser');

    httpTester.testPost('/api/authentication', credentials, globeUser, service.authenticate(credentials));

    expect(service.storeLoggedInUser).toHaveBeenCalledWith(globeUser);
  });

  it('should store the logged in user', () => {
    spyOn(mockLocalStorage, 'setItem');

    service.storeLoggedInUser(globeUser);

    expect(service.userEvents.getValue()).toBe(globeUser);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(globeUser));
    expect(jwtInterceptor.token).toBe(globeUser.token);
  });

  it('should retrieve a user if one is stored', () => {
    spyOn(mockLocalStorage, 'getItem').and.returnValue(JSON.stringify(globeUser));

    service._retrieveUser();

    expect(service.userEvents.getValue()).toEqual(globeUser);
    expect(jwtInterceptor.token).toBe(globeUser.token);
  });

  it('should retrieve no user if none stored', () => {
    spyOn(mockLocalStorage, 'getItem');

    service._retrieveUser();

    expect(service.userEvents.getValue()).toBeNull();
    expect(jwtInterceptor.token).toBeNull();
  });

  it('should logout the user', () => {
    service.userEvents.next(globeUser);

    spyOn(mockLocalStorage, 'removeItem');

    service.logout();

    expect(service.userEvents.getValue()).toBe(null);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('rememberMe');
    expect(jwtInterceptor.token).toBeNull();
  });

  it('should tell that the user is not logged in if the token is not present', () => {
    spyOn(mockLocalStorage, 'getItem').and.returnValue(null);

    expect(service.isLoggedIn()).toBeFalsy();

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('rememberMe');
  });

  it('should check the current user password', () => {
    service.userEvents.next({login: 'jb'} as UserModel);

    httpTester.testPost(
      '/api/authentication',
      {login: 'jb', password: 'secret'},
      null,
      service.checkPassword('secret'));
  });

  it('should change the current user password', () => {
    httpTester.testPut('/api/users/me/passwords', { newPassword: 'secret' }, service.changePassword('secret'));
  });

  it('should check the current user password with failure', () => {
    service.userEvents.next({login: 'jb'} as UserModel);

    let ok = false;
    service.checkPassword('secret').subscribe({ error: () => ok = true });

    const testRequest = http.expectOne({ url: '/api/authentication', method: 'POST' });
    expect(testRequest.request.body).toEqual({login: 'jb', password: 'secret'});
    testRequest.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(ok).toBe(true);
  });

  it('should get the user profile', () => {
    const expectedUser = { id: 1 } as ProfileModel;
    httpTester.testGet('/api/users/me/profile', expectedUser, service.getProfile());
  });

  it('should update the user profile', () => {
    const command = { email: 'jb@foo.com' } as ProfileCommand;
    httpTester.testPut('/api/users/me/profile', command, service.updateProfile(command));
  });
});

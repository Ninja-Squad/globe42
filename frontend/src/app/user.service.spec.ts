import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { UserModel } from './models/user.model';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';
import { HttpTester } from './http-tester.spec';

describe('UserService', () => {

  let service: UserService;
  let http: HttpTestingController;
  let httpTester: HttpTester;
  let jwtInterceptor: JwtInterceptorService;
  const originalLocalStorage = window.localStorage;
  const mockLocalStorage = {
    setItem: (key, value) => {},
    getItem: key => null,
    removeItem: key => {}
  };

  const globeUser = {
    id: 1,
    login: 'cedric',
    admin: true,
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, JwtInterceptorService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.get(UserService);
    http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
    jwtInterceptor = TestBed.get(JwtInterceptorService);
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

    service.retrieveUser();

    expect(service.userEvents.getValue()).toEqual(globeUser);
    expect(jwtInterceptor.token).toBe(globeUser.token);
  });

  it('should retrieve no user if none stored', () => {
    spyOn(mockLocalStorage, 'getItem');

    service.retrieveUser();

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

  it('should get a user', () => {
    const expectedUser = { id: 1 } as UserModel;
    httpTester.testGet('/api/users/1', expectedUser, service.get(1));
  });

  it('should update a user', () => {
    const command = { login: 'jb' } as UserCommand;
    httpTester.testPut('/api/users/2', command, service.update(2, command));
  });

  it('should create a user', () => {
    const command = { login: 'jb' } as UserCommand;
    const expectedUser = { id: 2 } as UserWithPasswordModel;
    httpTester.testPost('/api/users', command, expectedUser, service.create(command));
  });

  it('should list users', () => {
    const expectedUsers = [{ id: 1 }] as Array<UserModel>;
    httpTester.testGet('/api/users', expectedUsers, service.list());
  });

  it('should delete a user', () => {
    httpTester.testDelete('/api/users/2', service.delete(2));
  });

  it('should reset a user password', () => {
    const expectedUser = { id: 2 } as UserWithPasswordModel;
    httpTester.testPost('/api/users/2/password-resets', null, expectedUser, service.resetPassword(2));
  });

  it('should change the current user password', () => {
    httpTester.testPut('/api/users/me/passwords', { newPassword: 'secret' }, service.changePassword('secret'));
  });

  it('should check the current user password', () => {
    service.userEvents.next({login: 'jb'} as UserModel);

    httpTester.testPost(
      '/api/authentication',
      {login: 'jb', password: 'secret'},
      null,
      service.checkPassword('secret'));
  });

  it('should check the current user password with failure', () => {
    service.userEvents.next({login: 'jb'} as UserModel);

    let ok = false;
    service.checkPassword('secret').subscribe(null, () => ok = true);

    const testRequest = http.expectOne({ url: '/api/authentication', method: 'POST' });
    expect(testRequest.request.body).toEqual({login: 'jb', password: 'secret'});
    testRequest.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(ok).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { UserModel } from './models/user.model';
import { UserCommand } from './models/user.command';
import { UserWithPasswordModel } from './models/user-with-password.model';

describe('UserService', () => {

  let service: UserService;
  let http: HttpTestingController;
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

    let actualUser;
    service.authenticate(credentials).subscribe(user => actualUser = user);

    const testRequest = http.expectOne({ url: '/api/authentication', method: 'POST' });
    expect(testRequest.request.body).toEqual(credentials);
    testRequest.flush(globeUser);

    expect(actualUser).toEqual(globeUser);
    expect(service.storeLoggedInUser).toHaveBeenCalledWith(actualUser);
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
    const expectedUser: UserModel = { id: 1 } as UserModel;

    let actualUser;
    service.get(1).subscribe(user => actualUser = user);
    http.expectOne({url: '/api/users/1', method: 'GET'}).flush(expectedUser);

    expect(actualUser).toEqual(expectedUser);
  });

  it('should update a user', () => {
    const command: UserCommand = { login: 'jb' } as UserCommand;
    service.update(2, command).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/users/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(null);
  });

  it('should create a user', () => {
    const command: UserCommand = { login: 'jb' } as UserCommand;
    const expectedUser: UserWithPasswordModel = { id: 2 } as UserWithPasswordModel;

    let actualUser;
    service.create(command).subscribe(user => actualUser = user);

    const testRequest = http.expectOne({ url: '/api/users', method: 'POST' });
    expect(testRequest.request.body).toEqual(command);
    testRequest.flush(expectedUser);

    expect(actualUser).toEqual(expectedUser);
  });

  it('should list users', () => {
    const expectedUsers: Array<UserModel> = [{ id: 1 }] as Array<UserModel>;

    let actualUsers;
    service.list().subscribe(users => actualUsers = users);

    http.expectOne({url: '/api/users', method: 'GET'}).flush(expectedUsers);

    expect(actualUsers).toEqual(expectedUsers);
  });

  it('should delete a user', () => {
    service.delete(2).subscribe(() => {});
    http.expectOne({ url: '/api/users/2', method: 'DELETE' }).flush(null);
  });

  it('should reset a user password', () => {
    const expectedUser: UserWithPasswordModel = { id: 2 } as UserWithPasswordModel;

    let actualUser;
    service.resetPassword(2).subscribe(user => actualUser = user);

    const testRequest = http.expectOne({ url: '/api/users/2/password-resets', method: 'POST' });
    expect(testRequest.request.body).toBeNull();
    testRequest.flush(expectedUser);

    expect(actualUser).toEqual(expectedUser);
  });

  it('should change the current user password', () => {
    service.changePassword('secret').subscribe(() => {});

    const testRequest = http.expectOne({url: '/api/users/me/passwords', method: 'PUT'});
    expect(testRequest.request.body).toEqual({ newPassword: 'secret' });
    testRequest.flush(null);
  });

  it('should check the current user password', () => {
    service.userEvents.next({login: 'jb'} as UserModel);

    let ok = false;
    service.checkPassword('secret').subscribe(() => ok = true);

    const testRequest = http.expectOne({ url: '/api/authentication', method: 'POST' });
    expect(testRequest.request.body).toEqual({login: 'jb', password: 'secret'});
    testRequest.flush({id: 2});

    expect(ok).toBe(true);
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

import { async, TestBed } from '@angular/core/testing';
import { HttpModule, Http, RequestOptions, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserService } from './user.service';

describe('UserService', () => {

  let userService: UserService;
  let mockBackend: MockBackend;
  let requestOptions: RequestOptions;
  const originalLocalStorage = window.localStorage;
  const mockLocalStorage = {
    setItem: (key, value) => {},
    getItem: key => null,
    removeItem: key => {}
  };

  const user = {
    id: 1,
    login: 'cedric',
    admin: true,
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      UserService
    ]
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    requestOptions = TestBed.get(RequestOptions);
    // we use this instead of jasmine.spyOn to make it pass on Firefox
    // https://github.com/jasmine/jasmine/issues/299
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => Object.defineProperty(window, 'localStorage', { value: originalLocalStorage }));

  it('should authenticate a user', async(() => {
    const credentials = {login: 'cedric', password: 'hello'};

    // fake response
    const response = new Response(new ResponseOptions({ body: user }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe(`/api/authentication`);
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(JSON.parse(connection.request.getBody())).toEqual(credentials);
      connection.mockRespond(response);
    });

    // spy on the store method
    spyOn(userService, 'storeLoggedInUser');

    userService.authenticate(credentials)
      .subscribe(() => expect(userService.storeLoggedInUser).toHaveBeenCalledWith(user));
  }));

  it('should store the logged in user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'setItem');
    spyOn(requestOptions.headers, 'set');

    userService.storeLoggedInUser(user);

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(user));
    expect(requestOptions.headers.set).toHaveBeenCalledWith('Authorization', `Bearer ${user.token}`);
  });

  it('should retrieve a user if one is stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'getItem').and.returnValue(JSON.stringify(user));
    spyOn(requestOptions.headers, 'set');

    userService.retrieveUser();

    expect(userService.userEvents.next).toHaveBeenCalledWith(user);
    expect(requestOptions.headers.set).toHaveBeenCalledWith('Authorization', `Bearer ${user.token}`);
  });

  it('should retrieve no user if none stored', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'getItem');

    userService.retrieveUser();

    expect(userService.userEvents.next).not.toHaveBeenCalled();
  });

  it('should logout the user', () => {
    spyOn(userService.userEvents, 'next');
    spyOn(mockLocalStorage, 'removeItem');
    spyOn(requestOptions.headers, 'delete');

    userService.logout();

    expect(userService.userEvents.next).toHaveBeenCalledWith(null);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('rememberMe');
    expect(requestOptions.headers.delete).toHaveBeenCalledWith('Authorization');
  });

  it('should tell that the user is not logged in if the token is not present', () => {
    spyOn(mockLocalStorage, 'getItem').and.returnValue(null);

    expect(userService.isLoggedIn()).toBeFalsy();

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('rememberMe');
  });
});

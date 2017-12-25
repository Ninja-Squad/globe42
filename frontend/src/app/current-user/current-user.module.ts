import { ModuleWithProviders, NgModule } from '@angular/core';
import { CurrentUserService } from './current-user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticatedGuard } from './authenticated.guard';

@NgModule()
export class CurrentUserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CurrentUserModule,
      providers: [
        CurrentUserService,
        JwtInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: JwtInterceptorService,
          multi: true
        },
        AuthenticatedGuard
      ]
    };
  }
}

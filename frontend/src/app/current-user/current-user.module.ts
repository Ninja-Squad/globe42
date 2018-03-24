import { ModuleWithProviders, NgModule } from '@angular/core';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule()
export class CurrentUserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CurrentUserModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: JwtInterceptorService,
          multi: true
        }
      ]
    };
  }
}

import { Injectable } from '@angular/core';
import { ProfileModel } from './models/user.model';
import { Resolve } from '@angular/router';
import { CurrentUserService } from './current-user/current-user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<ProfileModel> {
  constructor(private currentUserService: CurrentUserService) {}

  resolve(): Observable<ProfileModel> {
    return this.currentUserService.getProfile();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CurrentUserService } from '../current-user/current-user.service';
import { ProfileCommand, ProfileModel } from '../models/user.model';

@Component({
  selector: 'gl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: UntypedFormGroup;
  profile: ProfileModel;

  constructor(
    private route: ActivatedRoute,
    fb: UntypedFormBuilder,
    private currentUserService: CurrentUserService,
    private router: Router
  ) {
    this.form = fb.group({
      email: ['', Validators.email],
      taskAssignmentEmailNotificationEnabled: [false]
    });
  }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile as ProfileModel;
    this.form.patchValue(this.profile as ProfileCommand);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.currentUserService
      .updateProfile(this.form.value)
      .subscribe(() => this.router.navigate(['/']));
  }
}

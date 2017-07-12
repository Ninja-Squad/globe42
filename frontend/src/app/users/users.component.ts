import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { sortBy } from '../utils';

@Component({
  selector: 'gl-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<UserModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
    sortBy(this.users, u => u.login);
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gl-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<UserModel> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
  }

}

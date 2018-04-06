import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCommand } from '../models/task.command';
import { PersonIdentityModel } from '../models/person.model';
import { UserModel } from '../models/user.model';
import { sortBy } from '../utils';
import { TaskModel } from '../models/task.model';
import { TaskCategoryModel } from '../models/task-category.model';
import { PersonTypeahead } from '../person/person-typeahead';
import { CurrentUserService } from '../current-user/current-user.service';

interface TaskFormModel {
  title: string;
  description: string;
  category: TaskCategoryModel;
  dueDate: string;
  concernedPerson: PersonIdentityModel;
  assignee: UserModel;
}

@Component({
  selector: 'gl-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

  editedTask: TaskModel;

  task: TaskFormModel = {
    title: '',
    description: '',
    category: null,
    dueDate: null,
    concernedPerson: null,
    assignee: null
  };

  users: Array<UserModel>;
  categories: Array<TaskCategoryModel>;

  cancelOrRedirectDestination = ['/tasks'];
  personTypeahead: PersonTypeahead;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private router: Router,
              private currentUserService: CurrentUserService) { }

  ngOnInit() {
    this.editedTask = this.route.snapshot.data.task;
    this.personTypeahead = new PersonTypeahead(this.route.snapshot.data.persons);
    this.users = this.sortUsers(this.route.snapshot.data.users);
    this.categories = this.route.snapshot.data.categories;

    const concernedPersonId = this.route.snapshot.paramMap.get('concerned-person');
    if (concernedPersonId) {
      this.cancelOrRedirectDestination = ['/persons', concernedPersonId, 'tasks'];
    }

    if (this.editedTask) {
      this.task.title = this.editedTask.title;
      this.task.description = this.editedTask.description;
      this.task.category = this.findWithId(this.categories, this.editedTask.category.id);
      this.task.dueDate = this.editedTask.dueDate;
      this.task.concernedPerson =
        this.editedTask.concernedPerson ? this.findWithId(this.personTypeahead.elements, this.editedTask.concernedPerson.id) : null;
      this.task.assignee = this.editedTask.assignee ? this.findWithId(this.users, this.editedTask.assignee.id) : null;
    } else {
      if (concernedPersonId) {
        this.task.concernedPerson = this.findWithId(this.personTypeahead.elements, +concernedPersonId);
      }
    }
  }

  save() {
    const command: TaskCommand = {
      title: this.task.title,
      description: this.task.description,
      categoryId: this.task.category.id,
      dueDate: this.task.dueDate,
      concernedPersonId: this.task.concernedPerson ? this.task.concernedPerson.id : null,
      assigneeId: this.task.assignee ? this.task.assignee.id : null
    };
    if (this.editedTask) {
      this.taskService.update(this.editedTask.id, command)
        .subscribe(() => this.router.navigate(this.cancelOrRedirectDestination));
    } else {
      this.taskService.create(command)
        .subscribe(() => this.router.navigate(this.cancelOrRedirectDestination));
    }
  }

  formatUser(user: UserModel) {
    if (user.id === this.currentUserService.userEvents.getValue().id) {
      return 'Moi';
    }
    return user.login;
  }

  private sortUsers(users: Array<UserModel>): Array<UserModel> {
    const me = users.filter(u => u.id === this.currentUserService.userEvents.getValue().id)[0];
    const result = sortBy(users.filter(u => u !== me), u => u.login);
    result.unshift(me);
    return result;
  }

  private findWithId<T extends { id: number }>(array: Array<T>, id: number): T {
    return array.filter(element => element.id === id)[0];
  }
}

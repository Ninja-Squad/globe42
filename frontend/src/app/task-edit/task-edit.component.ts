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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gl-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

  editedTask: TaskModel;
  taskForm: FormGroup;
  users: Array<UserModel>;
  categories: Array<TaskCategoryModel>;

  cancelOrRedirectDestination = ['/tasks'];
  personTypeahead: PersonTypeahead;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private router: Router,
              private currentUserService: CurrentUserService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.editedTask = this.route.snapshot.data.task;
    this.personTypeahead = new PersonTypeahead(this.route.snapshot.data.persons);
    this.users = this.sortUsers(this.route.snapshot.data.users);
    this.categories = this.route.snapshot.data.categories;

    const concernedPersonId = this.route.snapshot.paramMap.get('concerned-person');
    if (concernedPersonId) {
      this.cancelOrRedirectDestination = ['/persons', concernedPersonId, 'tasks'];
    }

    let concernedPerson: PersonIdentityModel = null;
    if (this.editedTask && this.editedTask.concernedPerson) {
      concernedPerson = this.findWithId(this.personTypeahead.elements, this.editedTask.concernedPerson.id);
    }
    else if (concernedPersonId) {
      concernedPerson = this.findWithId(this.personTypeahead.elements, +concernedPersonId);
    }

    this.taskForm = this.fb.group({
      title: [this.editedTask ? this.editedTask.title : '', Validators.required],
      description: [this.editedTask ? this.editedTask.description : '', Validators.required],
      category: [this.editedTask ? this.findWithId(this.categories, this.editedTask.category.id) : null, Validators.required],
      dueDate: this.editedTask ? this.editedTask.dueDate : null,
      concernedPerson,
      assignee: this.editedTask && this.editedTask.assignee? this.findWithId(this.users, this.editedTask.assignee.id) : null
    });
  }

  save() {
    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.value;
    const command: TaskCommand = {
      title: formValue.title,
      description: formValue.description,
      categoryId: formValue.category.id,
      dueDate: formValue.dueDate,
      concernedPersonId: formValue.concernedPerson ? formValue.concernedPerson.id : null,
      assigneeId: formValue.assignee ? formValue.assignee.id : null
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
    return array.find(element => element.id === id);
  }
}

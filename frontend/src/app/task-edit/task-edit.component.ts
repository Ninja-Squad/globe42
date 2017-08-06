import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCommand } from '../models/task.command';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PersonIdentityModel } from '../models/person.model';
import { FullnamePipe } from '../fullname.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { sortBy } from '../utils';
import { TaskModel } from '../models/task.model';

interface TaskFormModel {
  title: string;
  description: string;
  dueDate: NgbDateStruct;
  concernedPerson: PersonIdentityModel,
  assignee: UserModel
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
    dueDate: null,
    concernedPerson: null,
    assignee: null
  };

  users: Array<UserModel>;

  personFormatter = (result: PersonIdentityModel) => this.fullnamePipe.transform(result);

  cancelOrRedirectDestination = ['/tasks'];

  personSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? [] : this.persons.filter(person => this.isPersonAccepted(person, term)).slice(0, 10));

  private persons: Array<PersonIdentityModel>;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private router: Router,
              private parserFormatter: NgbDateParserFormatter,
              private fullnamePipe: FullnamePipe,
              private userService: UserService) { }

  ngOnInit() {
    this.editedTask = this.route.snapshot.data.task;
    this.persons = this.route.snapshot.data.persons;
    this.users = this.sortUsers(this.route.snapshot.data.users);

    if (this.editedTask) {
      this.task.title = this.editedTask.title;
      this.task.description = this.editedTask.description;
      this.task.dueDate = this.editedTask.dueDate ? this.parserFormatter.parse(this.editedTask.dueDate) : null;
      this.task.concernedPerson = this.editedTask.concernedPerson ? this.findWithId(this.persons, this.editedTask.concernedPerson.id) : null;
      this.task.assignee = this.editedTask.assignee ? this.findWithId(this.users, this.editedTask.assignee.id) : null;
    }
    else {
      const concernedPersonId = this.route.snapshot.paramMap.get('concerned-person');
      if (concernedPersonId) {
        this.task.concernedPerson = this.findWithId(this.persons, +concernedPersonId);
        this.cancelOrRedirectDestination = ['/persons', concernedPersonId, 'tasks'];
      }
    }
  }

  save() {
    const command: TaskCommand = {
      title: this.task.title,
      description: this.task.description,
      dueDate: this.task.dueDate ? this.parserFormatter.format(this.task.dueDate) : null,
      concernedPersonId: this.task.concernedPerson ? this.task.concernedPerson.id : null,
      assigneeId: this.task.assignee ? this.task.assignee.id : null
    };
    if (this.editedTask) {
      this.taskService.update(this.editedTask.id, command)
        .subscribe(() => this.router.navigate(this.cancelOrRedirectDestination));
    }
    else {
      this.taskService.create(command)
        .subscribe(() => this.router.navigate(this.cancelOrRedirectDestination));
    }
  }

  clearIfNoPerson(concernedPersonInput: HTMLInputElement) {
    if (!this.task.concernedPerson) {
      concernedPersonInput.value = '';
    }
  }

  formatUser(user: UserModel) {
    if (user.id === this.userService.userEvents.getValue().id) {
      return 'Moi';
    }
    return user.login;
  }

  private sortUsers(users: Array<UserModel>): Array<UserModel> {
    const me = users.filter(u => u.id === this.userService.userEvents.getValue().id)[0];
    const result = sortBy(users.filter(u => u !== me), u => u.login);
    result.unshift(me);
    return result;
  }

  private isPersonAccepted(person: PersonIdentityModel, term: string): boolean {
    const s = term.toLowerCase();
    return person.firstName.toLowerCase().includes(s)
      || person.lastName.toLowerCase().includes(s)
      || (person.nickName && person.nickName.toLowerCase().includes(s))
      || (person.mediationCode && person.mediationCode.toLowerCase().includes(s));
  }

  private findWithId<T extends {id: number}>(array: Array<T>, id: number): T {
    return array.filter(element => element.id === id)[0];
  }
}

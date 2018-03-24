import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { TaskModel } from '../models/task.model';
import { TaskEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { Observable } from 'rxjs';
import { PersonModel } from '../models/person.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'gl-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  taskListType: string;
  page: Page<TaskModel>;

  // the person, in case the task list type is 'person'. null otherwise
  person: PersonModel = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private tasksResolverService: TasksResolverService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.page = data.tasks;
      this.taskListType = data.taskListType;
      this.person = this.taskListType === 'person' ? this.route.parent.snapshot.data.person : null;
    });
  }

  loadPage(viewPageNumber: number) {
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {page: (viewPageNumber - 1).toString()}});
  }

  onTaskClicked(event: TaskEvent) {
    switch (event.type) {
      case 'assign':
        this.handleEvent(this.taskService.assignToSelf(event.task.id));
        break;
      case 'markAsDone':
        this.handleEvent(this.taskService.markAsDone(event.task.id));
        break;
      case 'cancel':
        this.handleEvent(this.taskService.cancel(event.task.id));
        break;
      case 'resurrect':
        this.handleEvent(this.taskService.resurrect(event.task.id));
        break;
      case 'unassign':
        this.handleEvent(this.taskService.unassign(event.task.id));
        break;
      case 'edit':
        const destination: Array<any> = ['/tasks', event.task.id, 'edit'];
        if (this.person) {
          destination.push({'concerned-person': this.person.id});
        }
        this.router.navigate(destination);
        break;
    }
  }

  private handleEvent(action: Observable<void>) {
    const currentPageNumber = this.page.number;
    action.pipe(
      switchMap(() => this.tasksResolverService.resolve(this.route.snapshot))
    ).subscribe(page => {
      // maybe we are displaying a page that doesn't exist anymore
      // so we check and reload with the last page if needed
      if (currentPageNumber >= page.totalPages && page.totalPages > 0) {
        this.loadPage(page.totalPages);
      } else {
        this.page = page;
      }
    },
    () => {});
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { TaskModel } from '../models/task.model';
import { TaskEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'gl-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  taskListType: string;
  page: Page<TaskModel>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private tasksResolverService: TasksResolverService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.page = data.tasks;
      this.taskListType = data.taskListType;
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
        throw new Error('not implemented yet');
    }
  }

  private handleEvent(action: Observable<void>) {
    const currentPageNumber = this.page.number;
    action.switchMap(() => this.tasksResolverService.resolve(this.route.snapshot))
      .subscribe(
        page => {
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { TaskModel } from '../models/task.model';
import 'rxjs/add/operator/pluck';
import { TaskEvent } from '../tasks/tasks.component';
import { TaskService } from '../task.service';
import { TasksResolverService } from '../tasks-resolver.service';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'gl-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  page: Page<TaskModel>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private tasksResolverService: TasksResolverService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.page = data.tasks);
  }

  loadPage(viewPageNumber: number) {
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {page: (viewPageNumber - 1).toString()}})
  }

  onTaskClicked(event: TaskEvent) {
    const currentPageNumber = this.page.number;
    if (event.type === 'resurrect') {
      this.taskService.resurrect(event.task.id)
        .switchMap(() => this.tasksResolverService.resolve(this.route.snapshot) as Observable<Page<TaskModel>>)
        .subscribe(
          page => {
            if (currentPageNumber >= page.totalPages && page.totalPages > 0) {
              this.loadPage(page.totalPages);
            }
            else {
              this.page = page;
            }
          },
          () => {});
    } else {
      throw new Error('should not happen');
    }
  }
}

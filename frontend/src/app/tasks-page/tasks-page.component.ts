import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../models/page';
import { TaskModel } from '../models/task.model';
import 'rxjs/add/operator/pluck';

@Component({
  selector: 'gl-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  page: Page<TaskModel>;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.page = data.tasks);
  }

  loadPage(pageNumber: number) {
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {page: (pageNumber - 1).toString()}})
  }
}

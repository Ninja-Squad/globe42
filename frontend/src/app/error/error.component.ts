import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { NavigationEnd, Router } from '@angular/router';
import { ERRORS, FunctionalErrorModel } from '../models/error.model';
import { interpolate } from '../utils';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'gl-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  error: {
    message: string,
    technical: boolean,
    status?: number
  };

  constructor(private interceptor: ErrorService, private router: Router) { }

  ngOnInit() {
    this.interceptor.functionalErrors.subscribe(
      err => this.error = { message: this.toMessage(err), technical: false });
    this.interceptor.technicalErrors.subscribe(
      err => this.error = { message: err.message, technical: true, status: err.status });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.error = null);
  }

  private toMessage(error: FunctionalErrorModel) {
    const template = ERRORS[error.code];
    if (!template) {
      return error.code;
    }
    if (error.parameters) {
      return interpolate(template, error.parameters);
    }
    return template;
  }
}

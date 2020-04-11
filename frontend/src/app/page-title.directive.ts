/* tslint:disable:directive-selector */
import { Directive, Input, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Directive({
  selector: 'gl-page-title'
})
export class PageTitleDirective implements OnDestroy {
  constructor(private titleService: Title) {}

  @Input() set title(title: string) {
    this.titleService.setTitle(`Globe42 - ${title}`);
  }

  ngOnDestroy(): void {
    this.titleService.setTitle('Globe42');
  }
}

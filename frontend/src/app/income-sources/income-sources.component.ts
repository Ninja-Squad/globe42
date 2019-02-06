import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeSourceModel } from '../models/income-source.model';

@Component({
  selector: 'gl-income-sources',
  templateUrl: './income-sources.component.html',
  styleUrls: ['./income-sources.component.scss']
})
export class IncomeSourcesComponent implements OnInit {

  incomeSources: Array<IncomeSourceModel>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.incomeSources = this.route.snapshot.data.incomeSources;
  }
}

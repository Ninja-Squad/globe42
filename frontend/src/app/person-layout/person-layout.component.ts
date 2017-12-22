import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import 'rxjs/add/operator/pluck';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent {

  person: PersonModel;

  constructor(private route: ActivatedRoute) {
    route.data.pluck('person').subscribe((person: PersonModel) => this.person = person);
  }
}

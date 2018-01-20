import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import 'rxjs/add/operator/map';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent {

  person: PersonModel;

  constructor(route: ActivatedRoute) {
    route.data.map(data => data.person as PersonModel).subscribe(person => this.person = person);
  }
}

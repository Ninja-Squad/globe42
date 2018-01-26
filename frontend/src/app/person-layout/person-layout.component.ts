import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonModel } from '../models/person.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'gl-person-layout',
  templateUrl: './person-layout.component.html',
  styleUrls: ['./person-layout.component.scss']
})
export class PersonLayoutComponent {

  person: PersonModel;

  constructor(route: ActivatedRoute) {
    route.data.pipe(
      map(data => data.person as PersonModel)
    ).subscribe(person => this.person = person);
  }
}

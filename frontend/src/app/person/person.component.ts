import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PersonModel } from '../models/person.model';

@Component({
  selector: 'gl-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  person: PersonModel;
  mapsUrl: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.person = this.route.parent.snapshot.data['person'];
    this.mapsUrl = this.person.city && this.person.address ? this.createMapsUrl() : null;
  }

  private createMapsUrl() {
    const address = `${this.person.address} ${this.person.city.code} ${this.person.city.city}`;
    return `https://www.google.fr/maps/place/${encodeURIComponent(address)}`;
  }
}

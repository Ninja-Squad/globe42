import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonModel } from '../models/person.model';
import { ConfirmService } from '../confirm.service';
import { FullnamePipe } from '../fullname.pipe';
import { PersonService } from '../person.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'gl-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  person: PersonModel;
  mapsUrl: string;

  noteEdited = false;

  constructor(private route: ActivatedRoute,
              private confirmService: ConfirmService,
              private personService: PersonService,
              private fullnamePipe: FullnamePipe,
              private router: Router) { }

  ngOnInit() {
    this.route.parent.data.pipe(
      map(data => data.person as PersonModel)
    ).subscribe(person => {
      this.person = person;
      this.mapsUrl = this.person.city && this.person.address ? this.createMapsUrl() : null;
    });
  }

  delete() {
    this.confirmService.confirm(
      { message: `Voulez-vous vraiment supprimer ${this.fullnamePipe.transform(this.person)}\u00a0?`}).pipe(
      switchMap(() => this.personService.delete(this.person.id))
    ).subscribe(() => this.router.navigate(['/persons']), () => {});
  }

  resurrect() {
    this.confirmService.confirm(
      { message: `Voulez-vous vraiment annuler la suppression de ${this.fullnamePipe.transform(this.person)}\u00a0?`}).pipe(
      switchMap(() => this.personService.resurrect(this.person.id))
    ).subscribe(() => this.router.navigate(['/persons']), () => {});
  }

  private createMapsUrl() {
    const address = `${this.person.address} ${this.person.city.code} ${this.person.city.city}`;
    return `https://www.google.fr/maps/place/${encodeURIComponent(address)}`;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonModel } from '../models/person.model';
import { NoteModel } from '../models/note.model';
import { ConfirmService } from '../confirm.service';
import { FullnamePipe } from '../fullname.pipe';
import { PersonService } from '../person.service';

@Component({
  selector: 'gl-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  person: PersonModel;
  mapsUrl: string;

  editedNote: NoteModel = null;

  constructor(private route: ActivatedRoute,
              private confirmService: ConfirmService,
              private personService: PersonService,
              private fullnamePipe: FullnamePipe,
              private router: Router) { }

  ngOnInit() {
    this.person = this.route.parent.snapshot.data['person'];
    this.mapsUrl = this.person.city && this.person.address ? this.createMapsUrl() : null;
  }

  delete() {
    this.confirmService.confirm(
      { message: `Voulez-vous vraiment supprimer ${this.fullnamePipe.transform(this.person)}\u00a0?`})
      .switchMap(() => this.personService.delete(this.person.id))
      .subscribe(() => this.router.navigate(['/persons']), () => {});
  }

  resurrect() {
    this.confirmService.confirm(
      { message: `Voulez-vous vraiment annuler la suppression de ${this.fullnamePipe.transform(this.person)}\u00a0?`})
      .switchMap(() => this.personService.resurrect(this.person.id))
      .subscribe(() => this.router.navigate(['/persons']), () => {});
  }

  private createMapsUrl() {
    const address = `${this.person.address} ${this.person.city.code} ${this.person.city.city}`;
    return `https://www.google.fr/maps/place/${encodeURIComponent(address)}`;
  }
}

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { PersonsComponent } from './persons.component';
import { AppModule } from '../app.module';

describe('PersonsComponent', () => {
  const activatedRoute = {
    snapshot: { data: { persons: [{ firstName: 'John', lastName: 'Doe' }] } }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should list persons', () => {
    const fixture = TestBed.createComponent(PersonsComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    const persons = nativeElement.querySelectorAll('.person-item');
    expect(persons.length).toBe(1);
  });
});

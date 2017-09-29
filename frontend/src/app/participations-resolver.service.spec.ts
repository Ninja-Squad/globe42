import { TestBed } from '@angular/core/testing';

import { ParticipationsResolverService } from './participations-resolver.service';
import { ParticipationService } from './participation.service';
import { HttpClientModule } from '@angular/common/http';
import { ParticipationModel } from './models/participation.model';
import { Observable } from 'rxjs/Observable';
import { PersonModel } from './models/person.model';

describe('ParticipationsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParticipationsResolverService, ParticipationService],
      imports: [HttpClientModule]
    });
  });

  it('should resolve the list of participations of a person', () => {
    const participationService = TestBed.get(ParticipationService);
    const participations = Observable.of([{ id: 1 }] as Array<ParticipationModel>);

    spyOn(participationService, 'list').and.returnValue(participations);

    const resolver: ParticipationsResolverService = TestBed.get(ParticipationsResolverService);
    const route: any = { parent: { data: { person: { id: 42 } as PersonModel } } };
    const result = resolver.resolve(route, null);
    expect(result).toBe(participations);
    expect(participationService.list).toHaveBeenCalledWith(42);
  });
});

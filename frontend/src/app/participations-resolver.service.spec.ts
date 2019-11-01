import { TestBed } from '@angular/core/testing';

import { ParticipationsResolverService } from './participations-resolver.service';
import { ParticipationService } from './participation.service';
import { ParticipationModel } from './models/participation.model';
import { of } from 'rxjs';
import { CurrentPersonService } from './current-person.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ParticipationsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const currentPersonService: CurrentPersonService = TestBed.inject(CurrentPersonService);
    spyOnProperty(currentPersonService, 'snapshot').and.returnValue({ id: 42 });
  });

  it('should resolve the list of participations of a person', () => {
    const participationService = TestBed.inject(ParticipationService);
    const participations = of([{ id: 1 }] as Array<ParticipationModel>);

    spyOn(participationService, 'list').and.returnValue(participations);

    const resolver: ParticipationsResolverService = TestBed.inject(ParticipationsResolverService);
    const result = resolver.resolve();
    expect(result).toBe(participations);
    expect(participationService.list).toHaveBeenCalledWith(42);
  });
});

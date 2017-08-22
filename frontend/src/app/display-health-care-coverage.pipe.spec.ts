import { DisplayHealthCareCoveragePipe } from './display-health-care-coverage.pipe';

describe('DisplayHealthCareCoveragePipe', () => {
  it('should translate health care coverage', () => {
    const pipe = new DisplayHealthCareCoveragePipe();
    expect(pipe.transform('RSI')).toBe('Régime Social des Indépendants');
    expect(pipe.transform('AME')).toBe('Aide médicale de l\'Etat');
  });
});

import { DisplayHealthCareCoveragePipe } from './display-health-care-coverage.pipe';

describe('DisplayHealthCareCoveragePipe', () => {
  it('should translate health care coverage', () => {
    const pipe = new DisplayHealthCareCoveragePipe();
    expect(pipe.transform('SSI')).toBe('Sécurité sociale des indépendants');
    expect(pipe.transform('AME')).toBe("Aide médicale de l'Etat");
  });
});

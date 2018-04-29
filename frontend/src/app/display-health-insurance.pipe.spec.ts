import { DisplayHealthInsurancePipe } from './display-health-insurance.pipe';

describe('DisplayHealthInsurancePipe', () => {
  it('should translate health insurance', () => {
    const pipe = new DisplayHealthInsurancePipe();
    expect(pipe.transform('ACS')).toBe('Aide à la Complémentaire Santé');
    expect(pipe.transform('AME')).toBe('Aide médicale de l\'Etat');
  });
});

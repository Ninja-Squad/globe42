import { DisplaySchoolLevelPipe } from './display-school-level.pipe';

describe('DisplaySchoolLevelPipe', () => {
  it('should translate school level', () => {
    const pipe = new DisplaySchoolLevelPipe();
    expect(pipe.transform('UNKNOWN')).toBe('Inconnue');
    expect(pipe.transform('NONE')).toBe('Aucune');
    expect(pipe.transform('PRIMARY')).toBe('Primaire');
    expect(pipe.transform('MIDDLE')).toBe('Collège');
    expect(pipe.transform('HIGH')).toBe('Lycée');
    expect(pipe.transform('HIGHER')).toBe('Études supérieures');
  });
});

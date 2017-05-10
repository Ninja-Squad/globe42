import { DisplayGenderPipe } from './display-gender.pipe';

describe('DisplayGenderPipe', () => {
  it('create an instance', () => {
    const pipe = new DisplayGenderPipe();
    expect(pipe.transform('male')).toBe('Homme');
    expect(pipe.transform('female')).toBe('Femme');
    expect(pipe.transform('other')).toBe('Autre');
  });
});

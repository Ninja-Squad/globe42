import { DisplayNoteCategoryPipe } from './display-note-category.pipe';

describe('DisplayNoteCategoryPipe', () => {
  it('should display a note category', () => {
    const pipe = new DisplayNoteCategoryPipe();
    expect(pipe.transform('APPOINTMENT')).toBe('Rendez-vous');
    expect(pipe.transform('OTHER')).toBe('Autre');
  });
});

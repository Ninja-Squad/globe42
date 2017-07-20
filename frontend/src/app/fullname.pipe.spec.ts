import { FullnamePipe } from './fullname.pipe';
import { PersonModel } from './models/person.model';

describe('FullnamePipe', () => {

  const pipe = new FullnamePipe();

  it('should not display anything if no first name or lastname of nickname', () => {
    const person : PersonModel = {} as PersonModel
    expect(pipe.transform(person)).toBe('');
  });

  it('should display first name and lastname when no nick name', () => {
    const person : PersonModel = {
      firstName: 'Cedric',
      lastName: 'Exbrayat'
    } as PersonModel;
    expect(pipe.transform(person)).toBe('Cedric Exbrayat');
  });

  it('should display first name and lastname and nick name', () => {
    const person : PersonModel = {
      firstName: 'Cedric',
      lastName: 'Exbrayat',
      nickName: 'Ced'
    } as PersonModel;
    expect(pipe.transform(person)).toBe('Cedric Exbrayat (Ced)');
  });
});

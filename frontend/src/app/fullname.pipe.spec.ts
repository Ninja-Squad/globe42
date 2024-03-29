import { FullnamePipe } from './fullname.pipe';
import { PersonIdentityModel } from './models/person.model';

describe('FullnamePipe', () => {
  const pipe = new FullnamePipe();

  it('should not display anything if no first name or lastname of nickname', () => {
    const person = {} as PersonIdentityModel;
    expect(pipe.transform(person)).toBe('');
    expect(pipe.transform(person, 'startWithLastNameUppercase')).toBe('');
  });

  it('should display first name and lastname when no nick name', () => {
    const person = {
      firstName: 'Cedric',
      lastName: 'Exbrayat'
    } as PersonIdentityModel;
    expect(pipe.transform(person)).toBe('Cedric Exbrayat');
    expect(pipe.transform(person, 'startWithLastNameUppercase')).toBe('EXBRAYAT Cedric');
  });

  it('should display first name and lastname and nick name', () => {
    const person: PersonIdentityModel = {
      firstName: 'Cedric',
      lastName: 'Exbrayat',
      nickName: 'Ced'
    } as PersonIdentityModel;
    expect(pipe.transform(person)).toBe('Cedric Exbrayat (Ced)');
    expect(pipe.transform(person, 'startWithLastNameUppercase')).toBe('EXBRAYAT Cedric (Ced)');
  });
});

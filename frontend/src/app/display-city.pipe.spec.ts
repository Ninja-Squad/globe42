import { DisplayCityPipe } from './display-city.pipe';

describe('DisplayCityPipe', () => {

  it('should display a city', () => {
    const pipe = new DisplayCityPipe();
    const city = { city: 'SAINT-ETIENNE', code: 42000 };

    const result = pipe.transform(city);

    expect(result).toBe('42000 SAINT-ETIENNE');

    const resultEmpty = pipe.transform(undefined);

    expect(resultEmpty).toBe('');
  });

});

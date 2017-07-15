import { TestBed } from '@angular/core/testing';

import { FrenchDatepickerI18nService } from './french-datepicker-i18n.service';

describe('FrenchDatepickerI18nService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrenchDatepickerI18nService]
    });
  });

  it('should return french days and months', () => {
    const service = TestBed.get(FrenchDatepickerI18nService);
    expect(service.getWeekdayShortName(1)).toBe('Lu');
    expect(service.getMonthShortName(1)).toBe('Jan');
    expect(service.getMonthFullName(1)).toBe('Janvier');
  });
});

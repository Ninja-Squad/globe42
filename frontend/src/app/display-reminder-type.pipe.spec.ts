import { DisplayReminderTypePipe } from './display-reminder-type.pipe';

describe('DisplayReminderTypePipe', () => {
  it('should translate reminder types', () => {
    const pipe = new DisplayReminderTypePipe();
    expect(pipe.transform('HEALTH_CHECK_TO_PLAN')).toBe('Bilan de santé à planifier');
  });
});

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReminderModel } from '../models/person.model';

@Component({
  selector: 'gl-person-reminders',
  templateUrl: './person-reminders.component.html',
  styleUrls: ['./person-reminders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonRemindersComponent {
  @Input() reminders: Array<ReminderModel>;
}

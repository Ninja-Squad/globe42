import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../task.service';
import { SpentTimeEvent } from '../tasks/tasks.component';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'gl-spent-time-add',
  templateUrl: './spent-time-add.component.html',
  styleUrls: ['./spent-time-add.component.scss']
})
export class SpentTimeAddComponent {

  @Input() taskModel: TaskModel;

  @Output() readonly spentTimeAdded = new EventEmitter<SpentTimeEvent>();
  @Output() readonly cancelled = new EventEmitter<void>();

  addForm: FormGroup;

  private addableValidator: ValidatorFn = (form: AbstractControl) => {
    console.log('validating');
    return form.get('hours').value > 0 || form.get('minutes').value > 0 ? null : { addable: false };
  };

  constructor(private taskService: TaskService,
              fb: FormBuilder) {
    this.addForm = fb.group({
      hours: [0, Validators.compose([Validators.required, Validators.min(0)])],
      minutes: [0, Validators.compose([Validators.required, Validators.min(0)])]
    }, {
      validator: this.addableValidator
    });
  }
  add() {
    const minutes = this.addForm.value.minutes + this.addForm.value.hours * 60;
    this.taskService.addSpentTime(this.taskModel.id, minutes).subscribe(spentTime => {
      this.spentTimeAdded.emit({ task: this.taskModel, spentTime });
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}

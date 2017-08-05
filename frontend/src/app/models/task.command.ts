export interface TaskCommand {
  title: string;
  description: string;
  dueDate: string;
  concernedPersonId: number;
  assigneeId: number;
}

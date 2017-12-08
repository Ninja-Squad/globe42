export interface TaskCommand {
  title: string;
  description: string;
  categoryId: number;
  dueDate: string;
  concernedPersonId: number;
  assigneeId: number;
}

export type TaskStatus = "todo" | "onProgress" | "done";

export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  dueDate: string;
}

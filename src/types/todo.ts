export type TodoStatus = "TODO" | "ON_PROGRESS" | "DONE";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
}

export interface KanbanData {
  TODO: Todo[];
  ON_PROGRESS: Todo[];
  DONE: Todo[];
}

export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdDate: string;
  dueDate?: string;
}

export interface CreateTodoItem {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoItem {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
}

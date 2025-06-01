import { TodoItem, CreateTodoItem, UpdateTodoItem } from '../types/TodoItem';

const API_URL = 'http://localhost:5005/api';

export const getTodos = async (): Promise<TodoItem[]> => {
  try {
    const response = await fetch(`${API_URL}/TodoItems`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

export const createTodo = async (todo: CreateTodoItem): Promise<TodoItem> => {
  const response = await fetch(`${API_URL}/TodoItems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

export const toggleTodoComplete = async (id: number): Promise<TodoItem> => {
  const response = await fetch(`${API_URL}/TodoItems/${id}/toggle`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to toggle todo');
  return response.json();
};

export const updateTodo = async (id: number, todo: UpdateTodoItem): Promise<void> => {
  const response = await fetch(`${API_URL}/TodoItems/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error('Failed to update todo');
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/TodoItems/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
};

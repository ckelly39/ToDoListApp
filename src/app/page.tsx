"use client";

import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';
import { TodoItem, CreateTodoItem } from '../types/TodoItem';

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<CreateTodoItem>({
    title: '',
    description: '',
    dueDate: ''
  });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const createdTodo = await createTodo(newTodo);
      setTodos([...todos, createdTodo]);
      setNewTodo({ title: '', description: '', dueDate: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      await updateTodo(id, { isCompleted: !todo.isCompleted });
      setTodos(todos.map(t => 
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading todos...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            ToDo List App
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <form onSubmit={handleAddTodo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter todo title"
                  required
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={newTodo.dueDate || ''}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newTodo.description || ''}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter description (optional)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Add Todo
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Todos ({todos.length})
          </h2>
          
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No todos yet!</p>
              <p className="text-gray-400">Add your first todo above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    todo.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          todo.isCompleted 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`mt-1 text-sm ${
                            todo.isCompleted 
                              ? 'line-through text-gray-400' 
                              : 'text-gray-600'
                          }`}>
                            {todo.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            Created: {new Date(todo.createdDate).toLocaleDateString()}
                          </span>
                          {todo.dueDate && (
                            <span>
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition duration-200"
                      title="Delete todo"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Backend: <a href="http://localhost:5005/swagger" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              API Documentation
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from './supabase-client';

interface Task {
  id: number;
  title: string;
  description: string;
}

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedDescription, setUpdatedDescription] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    const { error, data } = await supabase.from('tasks').select('*');
    if (error) {
      console.log('Error', error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const deleteTasks = async (id: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Error', error.message);
      return;
    }
    fetchTasks();
  };

  const updateTask = async (id: number) => {
    if (!updatedDescription.trim()) return;

    const { error } = await supabase
      .from('tasks')
      .update({ description: updatedDescription })
      .eq('id', id);

    if (error) {
      console.error('Error', error.message);
      return;
    }

    setEditingId(null);
    setUpdatedDescription('');
    fetchTasks();
  };

  const handleAddTodo = async () => {
    if (title && description) {
      const { error } = await supabase
        .from('tasks')
        .insert([{ title, description }]);

      if (error) {
        console.error('Error adding todo:', error.message);
        return;
      }

      setTitle('');
      setDescription('');
      fetchTasks();
    } else {
      alert('Please fill in both fields');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Todo App</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAddTodo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Add Todo
        </button>

        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks yet.</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 mb-3">{task.description}</p>

                  {editingId === task.id ? (
                    <div className="flex flex-col gap-2 mb-2">
                      <textarea
                        placeholder="Update description"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTask(task.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setUpdatedDescription(task.description);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 text-sm rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTasks(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

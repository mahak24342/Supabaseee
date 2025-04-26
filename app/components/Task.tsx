'use client';

import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { supabase } from '../supabase-client';

interface Task {
  id: number;
  title: string;
  description: string;
  image_url?: string;
}

export default function Task() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [taski, setTaski] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) console.log('Fetch Error:', error.message);
    else setTasks(data || []);
    setLoading(false);
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error('Delete Error:', error.message);
  };

  const updateTask = async (id: number) => {
    if (!updatedDescription.trim()) return;
    const { error } = await supabase.from('tasks').update({ description: updatedDescription }).eq('id', id);
    if (error) console.error('Update Error:', error.message);
    setEditingId(null);
    setUpdatedDescription('');
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `task-images/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from('task-images').upload(filePath, file);
    if (uploadError) {
      console.error('Upload Error:', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = await supabase.storage.from('task-images').getPublicUrl(filePath);
    return publicUrlData?.publicUrl ?? null;
  };

  const handleAddTodo = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both fields.');
      return;
    }

    let imageUrl: string | null = null;
    if (taski) {
      imageUrl = await uploadImage(taski);
    }

    const { error } = await supabase.from('tasks').insert([
      { title, description, image_url: imageUrl }
    ]);

    if (error) {
      console.error('Insert Error:', error.message);
      return;
    }

    setTitle('');
    setDescription('');
    setTaski(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaski(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('tasks-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, (payload) => {
        console.log('Realtime change:', payload);

        if (payload.eventType === 'INSERT') {
          const newTask = payload.new as Task;
          setTasks((prev) => [...prev, newTask]);
        }
        if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id as number;
          setTasks((prev) => prev.filter((task) => task.id !== deletedId));
        }
        if (payload.eventType === 'UPDATE') {
          const updatedTask = payload.new as Task;
          setTasks((prev) => prev.map((task) => task.id === updatedTask.id ? updatedTask : task));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mb-4"
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

                  {task.image_url && (
                    <img
                      src={task.image_url}
                      alt="Uploaded task"
                      className="mb-2 rounded-lg max-h-40 w-auto"
                    />
                  )}

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
                        onClick={() => deleteTask(task.id)}
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

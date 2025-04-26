'use client'

import React, { useState, useEffect } from 'react';
import Task from './components/Task';
import { Auth } from './components/Auth';
import { supabase } from './supabase-client';

const Page = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      {session ? (
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-indigo-600">Welcome!</h1>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition"
            >
              Logout
            </button>
          </div>
          <Task />
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default Page;

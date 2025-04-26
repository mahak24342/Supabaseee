'use client'

import { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "../supabase-client";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-indigo-500 hover:underline mt-2"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (res.ok) {
        setMessage('Check your email for a reset link');
      } else {
        setMessage('Something went wrong. Try again.');
      }
    };
  
    return (
      <div className="bg-[url('/Billboards.jpg')] min-h-screen flex items-center justify-center p-4">
      <div className="h-full max-w-6xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
      <div className="max-w-md mx-auto p-4 border rounded shadow">
        <h1 className="text-2xl mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            className="border p-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
      </div>
      </div>
    );
};
'use client';

import { errorToast } from '@/lib/toast';
import { useState } from 'react';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (res.ok) {
        setIsSent(true);
      } else if(res.status === 400) {
        errorToast("Email not found!");
      }
      else if(res.status === 401)
      {
        errorToast("You can't change your account password.");
      }
    };
  
    return (
      <div className="bg-[url('/Billboards.jpg')] min-h-screen flex items-center justify-center p-4">
      <div className="h-full max-w-6xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
      {!isSent && (<div className="max-w-md mx-auto p-4 border rounded shadow">
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" style={{alignItems: "center", cursor: "pointer"}}>
            Check your email to reset password
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>)}
      {isSent && (<>
        <div className="text-center space-y-4">
          <div style={{ fontSize: "42px", color: "black" }}>
            Email has been successfully sent
          </div>
          <div style={{ fontSize: "30px", color: "black" }}>
            You are retrieving your password. The reset link has been sent to your email <b>{email}</b>, please go and check it.
          </div>
        </div>
        </>)}
      </div>
      </div>
    );
};
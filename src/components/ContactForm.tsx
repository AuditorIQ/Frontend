'use client';

import { useState } from 'react';
import React from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    setStatus(result.message);
  };

  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <form className="grid grid-cols-1 md:grid-cols-2" style={{gap: "48px"}} onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="w-full border rounded-md p-2" name="name" placeholder="Type your name..." value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full border rounded-md p-2" name="email" placeholder="Type your email..." value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" className="w-full border rounded-md p-2" placeholder="Type your phone..."/>
        </div>
        <div>
          <label className="block text-sm font-medium">Postcode</label>
          <input type="text" className="w-full border rounded-md p-2" placeholder="Type your postcode..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Message</label>
          <textarea className="w-full border rounded-md p-2" name="message" placeholder="Type your message..." rows={4} value={formData.message} onChange={handleChange}></textarea>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800" style={{cursor: "pointer"}}>
            Submit
          </button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

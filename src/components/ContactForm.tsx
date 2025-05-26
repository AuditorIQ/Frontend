import React from 'react';

const ContactForm = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="w-full border rounded-md p-2" placeholder="Type your name..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full border rounded-md p-2" placeholder="Type your email..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" className="w-full border rounded-md p-2" placeholder="Type your phone..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Postcode</label>
          <input type="text" className="w-full border rounded-md p-2" placeholder="Type your postcode..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Message</label>
          <textarea className="w-full border rounded-md p-2" placeholder="Type your message..." rows={4}></textarea>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800">
            SUBMIT NOW
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

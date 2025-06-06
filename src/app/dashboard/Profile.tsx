"use client";

import { useState } from "react";

export default function Profile() {
  const [defaultSpecialty, setDefaultSpecialty] = useState("Podiatry");

  const saveDefault = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultSpecialty,
        email: sessionStorage.getItem("user_email"),
      }),
    });
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-medium">Default Specialty:</label>
      <select
        value={defaultSpecialty}
        onChange={(e) => setDefaultSpecialty(e.target.value)}
        className="border rounded p-2 mb-4"
      >
        <option>Podiatry</option>
        <option>Vascular Surgery</option>
        <option>Cardiology</option>
      </select>

      <button
        onClick={saveDefault}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Default
      </button>
    </div>
  );
}

"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

export default function Profile() {
  const [defaultSpecialty, setDefaultSpecialty] = useState(
    "Wound Qualification"
  );

  const saveDefault = async () => {
    const email = useAuthStore().user?.email;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultSpecialty,
        email,
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
        <option>Wound Care General</option>
        <option>Wound Qualification</option>
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

"use client";

import { useState } from "react";
import axios from "axios";

export default function surgery() {
  const [specialty, setSpecialty] = useState("Wound Care");
  const [form, setForm] = useState({
    diagnosisCodes: [""],
    procedureCodes: [""],
    modifiers: [""],
  });
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const runAudit = async () => {
    const res = await axios.post(`/api/audit/${specialty}`, form);
    setResult(res.data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Medicare Compliance Audit</h1>

      <select
        className="mb-4 p-2 border"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option value="Podiatry">Podiatry</option>
        <option value="Vascular">Vascular Surgery</option>
        <option value="Wound Care">Wound Care</option>
      </select>

      <div>
        <label className="block">Diagnosis Codes</label>
        <input
          className="w-full p-2 border mb-2"
          value={form.diagnosisCodes.join(",")}
          onChange={(e) =>
            handleChange("diagnosisCodes", e.target.value.split(","))
          }
        />
        <label className="block">Procedure Codes</label>
        <input
          className="w-full p-2 border mb-2"
          value={form.procedureCodes.join(",")}
          onChange={(e) =>
            handleChange("procedureCodes", e.target.value.split(","))
          }
        />
        <label className="block">Modifiers</label>
        <input
          className="w-full p-2 border mb-4"
          value={form.modifiers.join(",")}
          onChange={(e) => handleChange("modifiers", e.target.value.split(","))}
        />
      </div>

      <button
        onClick={runAudit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        style={{ cursor: "pointer" }}
      >
        Run Audit
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Audit Result</h2>
          <p>
            <strong>Specialty:</strong> {result.specialty}
          </p>
          <p>
            <strong>LCD:</strong> {result.lcd}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {result.isCompliant ? "Compliant ✅" : "Issues found ❌"}
          </p>
          {result.issues.length > 0 && (
            <ul className="list-disc list-inside text-red-600">
              {result.issues.map((i: string, idx: number) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

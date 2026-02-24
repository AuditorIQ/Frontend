"use client";
import React, { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Upload } from "lucide-react";

export default function Analyse() {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // MUST MATCH BACKEND

    try {
      setLoading(true);
      setError("");
      setResults([]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/woundchecklist`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Analysis failed");

      setResults(data.result?.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>

        <div className="flex-grow">
          {/* Upload */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
          hover:border-blue-400 hover:bg-blue-50 cursor-pointer`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0]; // SINGLE FILE
              if (file) handleFileUpload(file);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.png"
              multiple={false}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop a file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Accepted: PDF, DOCX, TXT, RTF, PNG
                </p>
              </div>

              {loading && (
                <p className="text-blue-600 font-medium mt-4">
                  Analyzing document...
                </p>
              )}

              {error && (
                <p className="text-red-600 font-medium mt-4">{error}</p>
              )}
            </div>
          </div>
          {/* Results */}
          {results.length > 0 && (
            <div className="overflow-auto rounded-lg border">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Criteria</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{item.Criteria}</td>
                      <td className="px-4 py-3 font-semibold">{item.Result}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.Evidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

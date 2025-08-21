"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import axios from "axios";
import { Edit, Save, Redo, ListRestart, RefreshCw } from "lucide-react";
import { successToast } from "@/lib/toast";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label: string;
}

function ToggleSwitch({ isOn, onToggle, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3 m-8">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isOn}
          onChange={onToggle}
          className="sr-only"
        />
        {/* Track */}
        <div
          className={`w-16 h-8 rounded-full transition-colors ${
            isOn ? "bg-blue-600" : "bg-blue-200"
          }`}
        />
        {/* Thumb */}
        <div
          className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            isOn ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </label>
      <span className="text-lg font-medium">{label}</span>
    </div>
  );
}

export default function prompt() {
  const [activeTab, setActiveTab] = useState<"Wound Care" | "Podiatry">(
    "Wound Care"
  );
  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleLabels = [
    "Diagnosis & Coverage",
    "Compliance Table",
    "Healing Trends",
    "Standard of Care (SOC)",
    "Compliance Review Table",
    "Auditor’s Note",
    "Key Recommendations",
  ];
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    toggleLabels.reduce((acc, label) => ({ ...acc, [label]: true }), {})
  );

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSave = async () => {
    setIsEdit(false);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/openai/update-prompt`,
      { specialty: activeTab, prompt: text }
    );
    successToast("Updated prompt successfully!");
  };
  const Resetprompt = async () => {
    setShowModal(true);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/openai/reset-prompt`,
      { specialty: activeTab }
    );
    successToast("Reset prompt successfully!");
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/get-prompt`,
        { specialty: activeTab }
      );
      setText(res.data.prompt);
    };
    fetchData();
  }, [activeTab, isReset, showModal]);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <header className="flex items-center justify-between px-8 bg-white border-b">
          <nav className="flex space-x-6 px-4">
            {["Wound Care", "Podiatry"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative pb-3 pt-2 transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-blue-700 font-semibold"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}

                {/* Active tab underline */}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-700 rounded-t"></span>
                )}
              </button>
            ))}
          </nav>
        </header>
        <main className="flex flex-1 py-10">
          <div className="flex flex-col w-full h-full gap-4">
            {/* First row: textarea + right panel */}
            <div className="flex w-full gap-6 h-full">
              {/* Left side - 70% */}
              <div className="w-7/10 bg-gray-50 p-4 rounded-lg shadow relative">
                <button
                  onClick={() => {
                    setIsReset(!isReset);
                    setShowModal(true);
                  }}
                  className="absolute top-6 right-25 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  <RefreshCw size={16}></RefreshCw>
                </button>
                {!isEdit ? (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="absolute top-6 right-10 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                  >
                    <Edit size={16}></Edit>
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="absolute top-6 right-10 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                  >
                    <Save size={16}></Save>
                  </button>
                )}

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`w-full h-full border-0 rounded p-2 
                    ${!isEdit ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                  disabled={!isEdit}
                />
              </div>

              {/* Right side - 30% */}
              <div className="w-3/10 bg-gray-100 p-4 rounded-lg shadow">
                <h1>Output Sections</h1>
                {toggleLabels.map((label) => (
                  <ToggleSwitch
                    key={label}
                    label={label}
                    isOn={toggles[label]}
                    onToggle={() => handleToggle(label)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: 30,
                borderRadius: 10,
                width: "400px",
                textAlign: "center",
              }}
            >
              <h3>Are you sure you want to reset the prompt?</h3>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <button
                  onClick={() => {
                    Resetprompt();
                    setShowModal(false);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  style={{ width: "40%", cursor: "pointer" }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  style={{ width: "40%", cursor: "pointer" }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

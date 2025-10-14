"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import PatientModal from "./PatientModal";
import { useRouter } from "next/navigation"; // Updated import for App Router
import { successToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Patient {
  id: number;
  ownerId: number;
  firstName: string;
  lastName: string;
  dateofBirth: string;
  gender: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchkey, setSearchKey] = useState("");

  const filteredDataset = patients.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchkey.toLowerCase())
    )
  );

  const SearchKeyChange = (e: any) => {
    const newValue = e.target.value;
    setSearchKey(newValue);
  };

  const ownerId = useAuthStore.getState().user?.id;

  // Fetch patients with error handling
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/patient/patient/${ownerId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch patients");

        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []); // Removed patients from dependencies to prevent infinite loops

  const handleGenderChange = (id: number, newGender: string) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id ? { ...patient, gender: newGender } : patient
      )
    );
  };

  const handleRowClick = (patientId: number) => {
    sessionStorage.setItem("currentPatientId", String(patientId));
    window.location.href = "/patientdetail";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <Card className="flex-1 p-4 flex items-center justify-center">
          <p>Loading patients...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <SubMenu />
        <div className="mt-8 p-4 mx-auto flex flex-col w-3/5 border border-gray-300 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Patients</h1>
          <div className="flex justify-between items-center mb-6 w-full">
            {/* Left side - Search */}
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-600" />
              <Input
                placeholder="Search"
                value={searchkey}
                onChange={SearchKeyChange}
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Right side - Button */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              + New Patient
            </button>
          </div>

          <PatientModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              successToast("New Patient is added.");
              setTimeout(() => window.location.reload(), 100);
              // Removed forced reload - let the natural state update handle it
            }}
          />

          <div className="overflow-x-auto w-full">
            {filteredDataset.length === 0 ? (
              <p className="py-4 text-gray-500">No patients found</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 border-b">First Name</th>
                    <th className="py-3 px-4 border-b">Last Name</th>
                    <th className="py-3 px-4 border-b">Date of Birth</th>
                    <th className="py-3 px-4 border-b">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataset.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`${
                        patient.id % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 cursor-pointer`}
                      onClick={() => handleRowClick(patient.id)}
                    >
                      <td className="py-3 px-4 border-b">
                        {patient.firstName}
                      </td>
                      <td className="py-3 px-4 border-b">{patient.lastName}</td>
                      <td className="py-3 px-4 border-b">
                        {new Date(patient.dateofBirth).toLocaleDateString(
                          "en-US"
                        )}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <label className="px-2 py-1">{patient.gender}</label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

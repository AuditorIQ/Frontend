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
import { DeleteIcon, Edit, Edit2, Search, Trash2 } from "lucide-react";
import axios from "axios";

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
  const [isEdit, setIsEdit] = useState<number | null>(null);

  const filteredDataset = patients.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchkey.toLowerCase())
    )
  );

  const removePatient = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    successToast("Removed Patient successfully.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const SearchKeyChange = (e: any) => {
    const newValue = e.target.value;
    setSearchKey(newValue);
  };

  const ownerId = useAuthStore.getState().user?.id;

  // Fetch patients with error handling
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

  useEffect(() => {
    fetchPatients();
  }, []); // Removed patients from dependencies to prevent infinite loops

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
                    <th className="py-3 px-4 border-b">Last Name</th>
                    <th className="py-3 px-4 border-b">First Name</th>
                    <th className="py-3 px-4 border-b">Date of Birth</th>
                    <th className="py-3 px-4 border-b">Gender</th>
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataset.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`${
                        patient.id % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 cursor-pointer`}
                    >
                      <td
                        className="py-3 px-4 border-b"
                        onClick={() => handleRowClick(patient.id)}
                      >
                        {patient.lastName}
                      </td>
                      <td
                        className="py-3 px-4 border-b"
                        onClick={() => handleRowClick(patient.id)}
                      >
                        {patient.firstName}
                      </td>
                      <td
                        className="py-3 px-4 border-b"
                        onClick={() => handleRowClick(patient.id)}
                      >
                        {new Date(patient.dateofBirth).toLocaleDateString(
                          "en-US"
                        )}
                      </td>
                      <td
                        className="py-3 px-4 border-b"
                        onClick={() => handleRowClick(patient.id)}
                      >
                        <label className="px-2 py-1">{patient.gender}</label>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={() => {
                              setIsEdit(patient.id);
                            }}
                          >
                            <Edit size={24} />
                          </button>

                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removePatient(patient.id)}
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </td>
                      {isEdit === patient.id && (
                        <PatientModal
                          isOpen={isEdit === patient.id ? true : false}
                          id={String(patient.id)}
                          lastName={
                            isEdit === patient.id ? patient.lastName : ""
                          }
                          firstName={
                            isEdit === patient.id ? patient.firstName : ""
                          }
                          dateofBirth={
                            isEdit === patient.id ? patient.dateofBirth : ""
                          }
                          gender={isEdit === patient.id ? patient.gender : ""}
                          onClose={() => {
                            setIsEdit(null);
                            // Removed forced reload - let the natural state update handle it
                          }}
                        />
                      )}
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

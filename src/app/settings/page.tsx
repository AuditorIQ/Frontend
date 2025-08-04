"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import { error } from "console";

export default function settings() {
  const [providerList, setProviderList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState<"MD" | "DO" | "DPM">("MD");
  const [npiNumber, setNpiNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id: sessionStorage.getItem("user_id") }),
        }
      );
      const providerData = await res.json();
      setProviderList(providerData.result);
    };
    fetchProviders();
  }, []);
  const removeProvider = async (id: number) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/${id}`
    );
    window.location.reload();
  };
  const handleAdd = async () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!credentials) newErrors.credentials = "Credentials are required";
    if (!npiNumber) newErrors.npiNumber = "NPI number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => {
        errorToast(msg);
      });
    }

    if (Object.keys(newErrors).length === 0) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/addprovider`,
        {
          firstName,
          lastName,
          credentials,
          npiNumber,
          userId: sessionStorage.getItem("user_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
    }
  };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 gap-4">
        <h2 className="text-lg font-semibold">Provider</h2>
        <div className="md:w-1/2 pt-4">
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Credentials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    NPI Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providerList.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 text-sm">{provider.firstName}</td>
                    <td className="px-6 py-4 text-sm">{provider.lastName}</td>
                    <td className="px-6 py-4 text-sm">
                      {provider.credentials}
                    </td>
                    <td className="px-6 py-4 text-sm">{provider.npiNumber}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeProvider(provider.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full pt-4">
          <Button
            onClick={() => {
              if (
                sessionStorage.getItem("subscriptionType") === "STARTER" &&
                providerList.length >= 3
              ) {
                errorToast(
                  "You can't add more providers. Please upgrade your plan."
                );
              } else if (
                sessionStorage.getItem("subscriptionType") === "PROFESSIONAL" &&
                providerList.length >= 10
              ) {
                errorToast(
                  "You can't add more providers. Please upgrade your plan."
                );
              } else {
                setShowModal(true);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            Add Provider
          </Button>
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Provider</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Credentials
                    </label>
                    <select
                      value={credentials}
                      onChange={(e) =>
                        setCredentials(e.target.value as "MD" | "DO" | "DPM")
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="MD">MD</option>
                      <option value="DO">DO</option>
                      <option value="DPM">DPM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      NPI Number
                    </label>
                    <input
                      type="text"
                      value={npiNumber}
                      onChange={(e) => setNpiNumber(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    style={{ cursor: "pointer" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleAdd();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

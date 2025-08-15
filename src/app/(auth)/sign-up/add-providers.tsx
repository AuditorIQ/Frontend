"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import useSignupFormStore from "@/stores/authStore";

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  credentials: "MD" | "DO" | "DPM";
  npiNumber: string;
  zipCode: string;
  specialty: "Woundcare" | "Podiatry";
}

interface AddProvidersProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AddProviders({
  formData,
  updateFormData,
  onNext,
  onBack,
}: AddProvidersProps) {
  const { setProviders: setProvidersZustand } = useSignupFormStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState<"MD" | "DO" | "DPM">("MD");
  const [npiNumber, setNpiNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [providers, setProviders] = useState<Provider[]>(
    Array.isArray(formData?.providers) ? formData.providers : []
  );
  const [specialty, setSpecialty] = useState<"Woundcare" | "Podiatry">(
    "Woundcare"
  );
  const [zipCode, setZipCode] = useState("");
  const [isEdit, setIsEdit] = useState<string | null>(null);

  const addProvider = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!credentials) newErrors.credentials = "Credentials are required";
    if (!npiNumber) newErrors.npiNumber = "NPI number is required";
    if (!zipCode) newErrors.zipCode = "Zip code is required";
    if (!specialty) newErrors.specialty = "Specialty is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newProvider: Provider = {
        id: Date.now().toString(),
        firstName,
        lastName,
        credentials,
        npiNumber,
        zipCode,
        specialty,
      };

      const updatedProviders = [...providers, newProvider];
      setProviders(updatedProviders);
      updateFormData({ providers: updatedProviders });

      setFirstName("");
      setLastName("");
      setCredentials("MD");
      setNpiNumber("");
      setZipCode("");
      setSpecialty("Woundcare");
    }
  };

  const updateProvider = () => {
    const updatedProviders = providers.map((provider) => {
      if (provider.id === isEdit) {
        return {
          ...provider,
          firstName,
          lastName,
          credentials,
          npiNumber,
          zipCode,
          specialty,
        };
      }
      return provider;
    });
    setProviders(updatedProviders);
    updateFormData({ providers: updatedProviders });

    setFirstName("");
    setLastName("");
    setCredentials("MD");
    setNpiNumber("");
    setZipCode("");
    setSpecialty("Woundcare");
    setIsEdit(null);
  };

  const removeProvider = (id: string) => {
    const updatedProviders = providers.filter((provider) => provider.id !== id);
    setProviders(updatedProviders);
    updateFormData({ providers: updatedProviders });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({ providers });
    setProvidersZustand(providers);
    onNext();
  };

  useEffect(() => {
    if (isEdit) {
      const provider = providers.find((provider) => provider.id === isEdit);
      if (provider) {
        setFirstName(provider.firstName);
        setLastName(provider.lastName);
        setCredentials(provider.credentials);
        setNpiNumber(provider.npiNumber);
        setZipCode(provider.zipCode);
        setSpecialty(provider.specialty);
      }
    }
  }, [isEdit]);

  return (
    <div className="bg-white p-6 rounded-lg max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Add Your Providers</h2>
      </div>
      <div className="rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-center gap-y-20 md:gap-x-20">
        <div className="md:w-1/3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials</Label>
            <select
              id="credentials"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={credentials}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "MD" || value === "DO" || value === "DPM") {
                  setCredentials(value);
                }
              }}
            >
              <option value="MD">MD</option>
              <option value="DO">DO</option>
              <option value="DPM">DPM</option>
            </select>
            {errors.credentials && (
              <p className="text-red-500 text-xs">{errors.credentials}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="npiNumber">NPI Number</Label>
            <Input
              id="npiNumber"
              type="text"
              placeholder="Enter NPI number"
              value={npiNumber}
              onChange={(e) => setNpiNumber(e.target.value)}
            />
            {errors.npiNumber && (
              <p className="text-red-500 text-xs">{errors.npiNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="Enter Zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs">{errors.zipCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <select
              id="specialty"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={specialty}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Woundcare" || value === "Podiatry") {
                  setSpecialty(value);
                }
              }}
            >
              <option value="Woundcare">Wound Care</option>
              <option value="Podiatry">Podiatry</option>
            </select>
            {errors.specialty && (
              <p className="text-red-500 text-xs">{errors.specialty}</p>
            )}
          </div>

          {isEdit ? (
            <Button
              type="button"
              onClick={updateProvider}
              className="w-full bg-secondary hover:bg-[#3da5d9]/90 text-text cursor-pointer"
            >
              Update Provider
            </Button>
          ) : (
            <Button
              type="button"
              onClick={addProvider}
              className="w-full bg-secondary hover:bg-[#3da5d9]/90 text-text cursor-pointer"
            >
              Add Provider
            </Button>
          )}
        </div>
        <div className="md:w-2/3">
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
                    Zip Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 text-sm">{provider.firstName}</td>
                    <td className="px-6 py-4 text-sm">{provider.lastName}</td>
                    <td className="px-6 py-4 text-sm">
                      {provider.credentials}
                    </td>
                    <td className="px-6 py-4 text-sm">{provider.npiNumber}</td>
                    <td className="px-6 py-4 text-sm">{provider.zipCode}</td>
                    <td className="px-6 py-4 text-sm">{provider.specialty}</td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEdit(provider.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Edit size={16} />
                        </button>
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
      </div>

      <div className="flex flex-row justify-between gap-4 w-full">
        <form onSubmit={onBack} className="w-full mb-2">
          <Button type="submit" className="w-full bg-[#0a2463] cursor-pointer">
            Back
          </Button>
        </form>
        <form onSubmit={handleSubmit} className="w-full">
          <Button type="submit" className="w-full bg-[#0a2463] cursor-pointer">
            Next
          </Button>
        </form>
      </div>
    </div>
  );
}

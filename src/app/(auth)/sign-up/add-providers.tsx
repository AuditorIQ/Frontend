"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import useSignupFormStore from "@/stores/authStore";

interface Provider {
  id: string;
  name: string;
  npiNumber: string;
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

  const [providerName, setProviderName] = useState("");
  const [npiNumber, setNpiNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [providers, setProviders] = useState<Provider[]>(
    formData.providers
    // || [
    //   { id: "1", name: "Dr. Williams", npiNumber: "123456" },
    //   { id: "2", name: "Dr. Smith", npiNumber: "13579" },
    //   { id: "3", name: "Dr. Robert", npiNumber: "24690" },
    // ]
  );
  const [isEdit, setIsEdit] = useState<string | null>(null);

  const addProvider = () => {
    // Validate
    const newErrors: Record<string, string> = {};

    if (!providerName) newErrors.providerName = "Provider name is required";
    if (!npiNumber) newErrors.npiNumber = "NPI number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newProvider = {
        id: Date.now().toString(),
        name: providerName,
        npiNumber,
      };

      const updatedProviders = [...providers, newProvider];
      setProviders(updatedProviders);
      updateFormData({ providers: updatedProviders });

      // Reset form
      setProviderName("");
      setNpiNumber("");
    }
  };
  const updateProvider = () => {
    const updatedProviders = providers.map((provider) => {
      if (provider.id === isEdit) {
        return {
          ...provider,
          name: providerName,
          npiNumber,
        };
      }
      return provider;
    });
    setProviders(updatedProviders);
    updateFormData({ providers: updatedProviders });
    setProviderName("");
    setNpiNumber("");
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
        setProviderName(provider.name);
        setNpiNumber(provider.npiNumber);
      }
    }
  }, [isEdit]);

  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto ">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Add Your Providers</h2>
      </div>

      <div className=" rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-center gap-y-20 md:gap-x-20">
        <div className="md:w-1/2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="providerName">Provider name</Label>
            <Input
              id="providerName"
              type="text"
              placeholder="Enter your provider name"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
            />
            {errors.providerName && (
              <p className="text-red-500 text-xs">{errors.providerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="npiNumber">NPI number</Label>
            <Input
              id="npiNumber"
              type="text"
              placeholder="Enter your provider NPI number"
              value={npiNumber}
              onChange={(e) => setNpiNumber(e.target.value)}
            />
            {errors.npiNumber && (
              <p className="text-red-500 text-xs">{errors.npiNumber}</p>
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

        <div className="md:w-1/2">
          <div className="mb-2">
            <h3 className="font-medium">Provider List</h3>
            <p className="text-xs text-gray-500 my-2">
              Up to 3 providers. Your subscription will be based on this count.
            </p>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPI number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {provider.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.npiNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEdit(provider.id);
                          }}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeProvider(provider.id)}
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

      <form onSubmit={handleSubmit} className="mx-auto w-full flex ">
        <Button
          type="submit"
          className="#w-full bg-[#0a2463] mx-auto cursor-pointer"
        >
          Continue to subscription
        </Button>
      </form>
    </div>
  );
}

"use client";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProvidersStore, Provider } from "@/stores/useProvidersStore";

export default function ProviderTab() {
  const userId = useAuthStore((s) => s.user?.id);
  const userSubscriptionType = useAuthStore((s) => s.user?.subscriptionType);

  const { providers, addProvider, removeProvider, setProviders } =
    useProvidersStore();

  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState<"MD" | "DO" | "DPM">("MD");
  const [npiNumber, setNpiNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [specialty, setSpecialty] = useState<"Woundcare" | "Podiatry">(
    "Woundcare"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // --- helper: hydrate from server when needed (e.g., when API doesn't return created row) ---
  const fetchAndHydrateProviders = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id: userId, specialty: "All" }),
        }
      );
      const data = await res.json();
      const list: Provider[] = Array.isArray(data?.result)
        ? data.result.map((p: any) => ({
            id: Number(p.id),
            firstName: String(p.firstName ?? ""),
            lastName: String(p.lastName ?? ""),
            credentials: (p.credentials ?? "MD") as "MD" | "DO" | "DPM",
            npiNumber: String(p.npiNumber ?? ""),
            zipCode: p.zipCode ? String(p.zipCode) : undefined,
            specialty: p.specialty as "Woundcare" | "Podiatry" | undefined,
          }))
        : [];
      setProviders(list);
    } catch (e) {
      console.error("Failed to hydrate providers", e);
      errorToast("Failed to refresh providers");
    }
  }, [setProviders, userId]);

  useEffect(() => {
    if (userId) {
      fetchAndHydrateProviders();
    }
  }, [userId, fetchAndHydrateProviders]);

  const canAddMore = () => {
    if (userSubscriptionType === "STARTER") return providers.length < 3;
    if (userSubscriptionType === "PROFESSIONAL") return providers.length < 10;
    return true;
  };

  const onClickAdd = () => {
    if (!canAddMore()) {
      errorToast("You can't add more providers. Please upgrade your plan.");
      return;
    }
    setShowModal(true);
  };

  const handleAdd = async () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!credentials) newErrors.credentials = "Credentials are required";
    if (!npiNumber) newErrors.npiNumber = "NPI number is required";
    if (!zipCode) newErrors.zipCode = "Zip code is required";
    if (!specialty) newErrors.specialty = "Specialty is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(errorToast);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/addprovider`,
        {
          firstName,
          lastName,
          credentials,
          npiNumber,
          zipCode,
          specialty,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      );

      // Expect the server to return the created provider; otherwise, hydrate.
      const created: any = res.data?.result || res.data?.provider || res.data;
      const createdId = Number(created?.id);

      if (created && Number.isFinite(createdId)) {
        const normalized: Provider = {
          id: createdId,
          firstName: String(created.firstName ?? firstName),
          lastName: String(created.lastName ?? lastName),
          credentials: (created.credentials ?? credentials) as
            | "MD"
            | "DO"
            | "DPM",
          npiNumber: String(created.npiNumber ?? npiNumber),
          zipCode: String(created.zipCode ?? zipCode),
          specialty: (created.specialty ?? specialty) as
            | "Woundcare"
            | "Podiatry",
        };
        addProvider(normalized); // ✅ only real server id goes to store
      } else {
        // Server didn't send created row => single refresh (still minimal)
        await fetchAndHydrateProviders();
      }

      successToast("Successfully added a new Provider");
      setShowModal(false);

      // reset modal fields
      setFirstName("");
      setLastName("");
      setCredentials("MD");
      setNpiNumber("");
      setZipCode("");
      setSpecialty("Woundcare");
    } catch (e) {
      console.error(e);
      errorToast("Failed to add provider");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Guard: only delete when we have a valid server id (INT4)
    if (!Number.isFinite(id) || id <= 0 || id > 2147483647) {
      // Try a quick re-hydrate to replace any stale/temp entries
      await fetchAndHydrateProviders();
      errorToast("That provider is not synced yet. Refreshed your list.");
      return;
    }

    try {
      setIsDeleting(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      );
      removeProvider(id);
      successToast("Successfully removed a Provider");
    } catch (e) {
      console.error(e);
      errorToast("Failed to remove provider");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow w-full"
      style={{ width: "100%" }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Provider Details
      </h2>

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
              {providers.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-sm" colSpan={7}>
                    No providers yet.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
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
                          onClick={() => handleDelete(provider.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                          disabled={isDeleting === provider.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full pt-4">
        <button
          type="button"
          className="bg-blue-900 text-white py-2 px-4 rounded mt-6 hover:bg-blue-800"
          onClick={onClickAdd}
          style={{ cursor: "pointer" }}
        >
          Add Provider
        </button>

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
                  {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.firstName}
                    </p>
                  )}
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
                  {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lastName}
                    </p>
                  )}
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
                  {errors.credentials && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.credentials}
                    </p>
                  )}
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
                  {errors.npiNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.npiNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                  {errors.zipCode && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) =>
                      setSpecialty(e.target.value as "Woundcare" | "Podiatry")
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="Woundcare">Wound Care General</option>
                    <option value="Podiatry">Wound Qualification</option>
                  </select>
                  {errors.specialty && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.specialty}
                    </p>
                  )}
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
                  onClick={handleAdd}
                  style={{ cursor: "pointer" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

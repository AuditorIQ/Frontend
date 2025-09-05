"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import { FileType, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import SubMenu from "@/components/SubMenu/SubMenu";
import { spec } from "node:test/reporters";

export default function settings() {
  const [providerList, setProviderList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deletedModal, setDeletedModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState<"MD" | "DO" | "DPM">("MD");
  const [specialty, setSpecialty] = useState<"Woundcare" | "Podiatry">(
    "Woundcare"
  );
  const [npiNumber, setNpiNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<"Account" | "Provider">("Account");
  const [avatar, setAvatar] = useState<string>("avatar.ico");

  const [enableFlg, setEnableFlg] = useState(false);

  const [profileData, setProfileData] = useState({
    FullName: "",
    ZipCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProviders = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Id: sessionStorage.getItem("user_id"),
            specialty: "All",
          }),
        }
      );
      const providerData = await res.json();
      setProviderList(providerData.result);

      // Only fetch avatar if not already cached
      const cachedAvatar = sessionStorage.getItem("user_avatar");
      if (cachedAvatar) {
        setAvatar(cachedAvatar);
      } else {
        const userId = sessionStorage.getItem("user_id");
        if (userId) {
          const res_url = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent(userId)}&fileType=${encodeURIComponent("image/png")}`
          );
          const { uploadURL, url } = await res_url.json();
          const avatarUrl = url === "NotFound" ? "avatar.ico" : url;
          setAvatar(avatarUrl);
          sessionStorage.setItem("user_avatar", avatarUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    const initialData = {
      FullName: sessionStorage.getItem("user_name") || "",
      ZipCode: sessionStorage.getItem("zipCode") || "",
    };
    setProfileData(initialData);
    fetchProviders();
  }, []);

  const removeProvider = async (id: number) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/${id}`
    );
    fetchProviders();
    successToast("Successfully removed a Provider");
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
          zipCode,
          specialty,
          userId: sessionStorage.getItem("user_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchProviders();
    }
    successToast("Successfully added a new Provider");
  };
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/update`,
      {
        id: sessionStorage.getItem("user_id"),
        profileData,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    sessionStorage.setItem("user_name", profileData.FullName);
    sessionStorage.setItem("zipCode", profileData.ZipCode);
    window.location.reload();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;
    const myId = sessionStorage.getItem("user_id");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/changepassword`,
        {
          id: parseInt(myId ?? "0", 10),
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      );

      // Success case
      successToast(res.data.message || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          errorToast("Please type your correct password!");
        } else if (status === 402) {
          errorToast("Confirm password mismatch!");
        } else if (status === 404) {
          errorToast("User not found!");
        } else {
          errorToast("An error occurred while updating your password.");
        }
      } else {
        errorToast("Unexpected error occurred.");
      }
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    console.log("Account deleted");
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatar("avatar.ico");
      return;
    }
    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);

    try {
      // Step 1: Get pre-signed URLs from backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent((await sessionStorage.getItem("user_id")) as string)}&fileType=${encodeURIComponent(file.type)}`
      );
      const { uploadURL, url } = await res.json();

      // Step 2: Upload file directly to S3
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadRes.status !== 200) {
        console.error("Upload failed", uploadRes);
        return;
      }
      const userId = await sessionStorage.getItem("user_id");

      setAvatar(url); // use the S3 URL as avatar source

      // Update cached avatar and timestamp
      sessionStorage.setItem("user_avatar", url);
      sessionStorage.setItem("last_avatar_fetch", Date.now().toString());

      window.location.reload();
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <header className="flex items-center justify-between px-8 bg-white border-b">
          <nav className="flex space-x-6 px-4">
            {["Account", "Provider"].map((tab) => (
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
          {/* Account Tab */}
          {activeTab === "Account" && (
            <div className="w-full">
              <form
                className="bg-white p-6 rounded-lg w-2/3"
                style={{ border: "none" }}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Profile Details
                    </h2>
                  </div>
                  <div className="col-span-9">
                    <div className="flex items-center space-x-4 py-4">
                      <img
                        src={avatar || "avatar.ico"}
                        alt="User avatar"
                        onError={(e) => (e.currentTarget.src = "avatar.ico")}
                        className="w-32 h-32 object-cover rounded-full"
                      />
                      <div>
                        <label className="inline-block cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Change avatar
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h6>Full Name</h6>
                      <input
                        type="text"
                        name="FullName"
                        placeholder="Full Name"
                        value={profileData.FullName}
                        onChange={handleProfileChange}
                        disabled={!enableFlg} // Enable only if enableFlg is true
                        className={`border rounded p-2 text-sm w-full ${
                          !enableFlg
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <h6>Zip Code</h6>
                      <input
                        type="text"
                        name="ZipCode"
                        placeholder="Zip/postal code"
                        value={profileData.ZipCode}
                        onChange={handleProfileChange}
                        disabled={!enableFlg} // Only enabled when enableFlg === true
                        className={`border rounded p-2 text-sm w-full ${
                          !enableFlg
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <div className="flex items-center gap-4">
                        <button
                          className="bg-blue-900 text-white py-2 px-4 rounded mt-6 hover:bg-blue-800"
                          style={{ cursor: "pointer" }}
                          disabled={enableFlg}
                          onClick={() => setEnableFlg(true)}
                        >
                          Edit
                        </button>
                        {enableFlg && (
                          <button
                            type="submit"
                            className="bg-green-900 text-white py-2 px-4 rounded mt-6 hover:bg-green-800"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setEnableFlg(false);
                              handleProfileSubmit();
                            }}
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="border-b"></div>
              <form
                onSubmit={handlePasswordSubmit}
                className="bg-white p-6 rounded-lg w-2/3"
                style={{ border: "none" }}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Change Password
                    </h2>
                  </div>
                  <div className="col-span-9">
                    <div className="space-y-4">
                      <h6>Current Password</h6>
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="border rounded p-2 text-sm w-full"
                      />
                      <h6>New Password</h6>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="border rounded p-2 text-sm w-full"
                      />
                      <h6>Confirm Password</h6>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="border rounded p-2 text-sm w-full"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-900 text-white py-2 px-4 rounded mt-6 hover:bg-blue-800"
                      style={{ cursor: "pointer" }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
              <div className="border-b"></div>
              <form
                onSubmit={handleDeleteAccount}
                className="bg-white p-6 rounded-lg w-2/3"
                style={{ border: "none" }}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Delete Account
                    </h2>
                  </div>
                  <div className="col-span-9">
                    <Button
                      style={{ backgroundColor: "red", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setDeletedModal(true);
                      }}
                    >
                      Close my account
                    </Button>
                  </div>
                  {deletedModal && (
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
                        <h3>Are you sure you want to close the account?</h3>
                        <div
                          style={{
                            marginTop: 20,
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            style={{ width: "40%", cursor: "pointer" }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletedModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            style={{ width: "40%", cursor: "pointer" }}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
          {/* Provider Tab */}
          {activeTab === "Provider" && (
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
                      {providerList.map((provider) => (
                        <tr key={provider.id}>
                          <td className="px-6 py-4 text-sm">
                            {provider.firstName}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {provider.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {provider.credentials}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {provider.npiNumber}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {provider.zipCode}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {provider.specialty}
                          </td>
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
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 px-4 rounded mt-6 hover:bg-blue-800"
                  onClick={() => {
                    if (
                      sessionStorage.getItem("subscriptionType") ===
                        "STARTER" &&
                      providerList.length >= 3
                    ) {
                      errorToast(
                        "You can't add more providers. Please upgrade your plan."
                      );
                    } else if (
                      sessionStorage.getItem("subscriptionType") ===
                        "PROFESSIONAL" &&
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
                </button>
                {showModal && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                      <h2 className="text-xl font-semibold mb-4">
                        Add Provider
                      </h2>
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
                              setCredentials(
                                e.target.value as "MD" | "DO" | "DPM"
                              )
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
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Specialty
                          </label>
                          <select
                            value={specialty}
                            onChange={(e) =>
                              setSpecialty(
                                e.target.value as "Woundcare" | "Podiatry"
                              )
                            }
                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                          >
                            <option value="Woundcare">Woundcare</option>
                            <option value="Podiatry">Podiatry</option>
                          </select>
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
                            setShowModal(false);
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
            </div>
          )}
        </main>
      </Card>
    </div>
  );
}

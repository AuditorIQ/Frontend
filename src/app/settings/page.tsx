"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import SubMenu from "@/components/SubMenu/SubMenu";
import { useAuthStore } from "@/stores/useAuthStore";
import ProviderTab from "./ProviderTab";

type TabKey = "Account" | "Provider";

export default function Settings() {
  // Auth / user
  const userId = useAuthStore((s) => s.user?.id);
  const userAvatar = useAuthStore((s) => s.user?.avatar);
  const updateUser = useAuthStore((s) => s.updateUser);

  const name = useAuthStore((s) => s.user?.name ?? "");
  const zip = useAuthStore((s) => s.user?.zipCode ?? "");

  // Local state
  const [activeTab, setActiveTab] = useState<TabKey>("Account");
  const [avatar, setAvatar] = useState<string>("avatar.ico");
  const [enableFlg, setEnableFlg] = useState(false);
  const [deletedModal, setDeletedModal] = useState(false);

  const [profileData, setProfileData] = useState({ FullName: "", ZipCode: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hydrate profile from store
  useEffect(() => {
    setProfileData({ FullName: name, ZipCode: zip });
  }, [name, zip]);

  // Avatar loader (separate from providers)
  useEffect(() => {
    (async () => {
      try {
        if (userAvatar) {
          setAvatar(userAvatar);
          return;
        }
        if (!userId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent(
            userId
          )}&fileType=${encodeURIComponent("image/png")}`
        );
        const { url } = await res.json();
        const avatarUrl = url === "NotFound" ? "avatar.ico" : url;
        setAvatar(avatarUrl);
        updateUser({ avatar: avatarUrl });
      } catch (e) {
        console.error("Avatar presign failed", e);
      }
    })();
  }, [userId, userAvatar, updateUser]);

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/update`,
        { id: userId, profileData },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
          },
        }
      );
      updateUser({ name: profileData.FullName, zipCode: profileData.ZipCode });
      successToast("Profile updated");
    } catch (e) {
      console.error(e);
      errorToast("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/changepassword`,
        {
          id: parseInt(userId ?? "0", 10),
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

      successToast(res.data?.message || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) errorToast("Please type your correct password!");
        else if (status === 402) errorToast("Confirm password mismatch!");
        else if (status === 404) errorToast("User not found!");
        else errorToast("An error occurred while updating your password.");
      } else {
        errorToast("Unexpected error occurred.");
      }
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account deleted");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatar("avatar.ico");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent(
          userId as string
        )}&fileType=${encodeURIComponent(file.type)}`
      );
      const { uploadURL, url } = await res.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadRes.status !== 200) {
        console.error("Upload failed", uploadRes);
        errorToast("Avatar upload failed");
        return;
      }

      setAvatar(url);
      updateUser({ avatar: url, lastAvatarFetch: Date.now().toString() });
      successToast("Avatar updated");
    } catch (err) {
      console.error("Error uploading file:", err);
      errorToast("Error uploading avatar");
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
            {(["Account", "Provider"] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 pt-2 transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-blue-700 font-semibold"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-700 rounded-t"></span>
                )}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex flex-1 py-10">
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
                        disabled={!enableFlg}
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
                        disabled={!enableFlg}
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
                          onClick={(e) => {
                            e.preventDefault();
                            setEnableFlg(true);
                          }}
                        >
                          Edit
                        </button>

                        {enableFlg && (
                          <button
                            type="submit"
                            className="bg-green-900 text-white py-2 px-4 rounded mt-6 hover:bg-green-800"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
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

          {activeTab === "Provider" && <ProviderTab />}
        </main>
      </Card>
    </div>
  );
}

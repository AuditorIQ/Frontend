"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; // Adjust path based on your project
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/useAuthStore";

const SubMenu: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const userName = user?.name || null;
  const userEmail = user?.email || null;
  const cachedAvatar = user?.avatar;
  const lastAvatarFetch = user?.lastAvatarFetch;
  useEffect(() => {
    const fetchUserData = async () => {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (
        cachedAvatar &&
        lastAvatarFetch &&
        now - parseInt(lastAvatarFetch) < fiveMinutes
      ) {
        setUserAvatar(cachedAvatar);
        return;
      }

      try {
        if (!user?.id) {
          setUserAvatar("avatar.ico");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent(user.id)}&fileType=${encodeURIComponent("image/png")}`
        );

        if (res.ok) {
          const { url } = await res.json();
          const avatarUrl = url === "NotFound" ? "avatar.ico" : url;
          setUserAvatar(avatarUrl);

          // ✅ update Zustand safely
          updateUser({
            avatar: avatarUrl,
            lastAvatarFetch: Date.now().toString(),
          });
        } else {
          setUserAvatar("avatar.ico");
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setUserAvatar("avatar.ico");
      }
    };

    fetchUserData();
  }, [user?.id, cachedAvatar, lastAvatarFetch, updateUser]);

  return (
    <div className="flex justify-end items-center">
      {/* Search Box */}
      {/* <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-600" />
        <Input
          placeholder="Search"
          value={searchKey}
          onChange={onSearchKeyChange}
          className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {/* Notifications + User Menu */}
      <div className="relative inline-block">
        <div ref={containerRef} className="flex gap-2 items-center">
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Toggle notifications"
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ cursor: "pointer" }}
          >
            <BellIcon className="w-6 h-6 text-gray-700" />
          </button>

          {/* User Dropdown */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            style={{ cursor: "pointer", maxWidth: "40px", maxHeight: "40px" }}
          >
            <img
              src={userAvatar || "avatar.ico"}
              className="w-10 h-10 object-cover rounded-full"
            />
          </button>
          <svg
            className="w-3 h-3 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>

          {/* Notification Popup */}
          {showNotifications && (
            <div
              className="absolute top-full right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-30"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            </div>
          )}

          {/* User Menu Popup */}
          {open && (
            <div
              className="absolute top-full right-0 mt-2 w-50 bg-white border rounded-lg shadow-lg"
              onMouseLeave={() => setOpen(false)}
            >
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                style={{ cursor: "pointer" }}
              >
                <div>{userName}</div>
                <div style={{ fontSize: "calc(1em - 2px)" }}>{userEmail}</div>
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => (window.location.href = "/settings")}
                style={{ cursor: "pointer" }}
              >
                Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => (window.location.href = "/logout")}
                style={{ cursor: "pointer" }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubMenu;

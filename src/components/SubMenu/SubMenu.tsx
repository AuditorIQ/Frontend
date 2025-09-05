"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; // Adjust path based on your project
import { BellIcon } from "@heroicons/react/24/outline";

const SubMenu: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Set user data from session storage first
      const userName = sessionStorage.getItem("user_name");
      const userEmail = sessionStorage.getItem("user_email");
      const cachedAvatar = sessionStorage.getItem("user_avatar");

      setUserName(userName);
      setUserEmail(userEmail);

      // Only fetch avatar if not cached or if it's been more than 5 minutes
      const lastAvatarFetch = sessionStorage.getItem("last_avatar_fetch");
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
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
          setUserAvatar("avatar.ico");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/presign-avatar?fileName=${encodeURIComponent(userId)}&fileType=${encodeURIComponent("image/png")}`
        );

        if (res.ok) {
          const { uploadURL, url } = await res.json();
          const avatarUrl = url === "NotFound" ? "avatar.ico" : url;
          setUserAvatar(avatarUrl);

          // Cache the avatar URL and timestamp
          sessionStorage.setItem("user_avatar", avatarUrl);
          sessionStorage.setItem("last_avatar_fetch", now.toString());
        } else {
          setUserAvatar("avatar.ico");
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setUserAvatar("avatar.ico");
      }
    };

    fetchUserData();
  }, []);

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

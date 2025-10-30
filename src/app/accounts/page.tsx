"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  practiceName: string;
  zipCode: string;
  subscriptionType: string;
  isAdmin: boolean;
  createdAt: string;
};

export default function accounts() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const handleView = (user: any) => {
    // ✅ Save the selected user to sessionStorage
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    // ✅ Navigate to /subview (URL stays clean)
    router.push("/accountview");
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/users`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <div className="flex-grow">
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              User Management
            </h1>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                <table className="min-w-full text-sm text-gray-700 text-center">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Practice</th>
                      <th className="py-3 px-4">Zip Code</th>
                      <th className="py-3 px-4">Subscription</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-blue-50 transition duration-200"
                      >
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.practiceName}</td>
                        <td className="py-3 px-4">{user.zipCode}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${
                              user.isAdmin
                                ? "bg-purple-100 text-purple-700"
                                : user.subscriptionType === "FREE"
                                  ? "bg-gray-100 text-gray-700"
                                  : user.subscriptionType === "STARTER"
                                    ? "bg-blue-100 text-blue-700"
                                    : user.subscriptionType === "PROFESSIONAL"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : user.subscriptionType === "ENTERPRISE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.isAdmin ? "UNLIMITED" : user.subscriptionType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isAdmin ? "Admin" : "User"}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-100"
                            onClick={() => handleView(user)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="py-8 text-gray-500 text-center">
                    No users found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

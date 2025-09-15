"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import UploadModal from "@/app/dashboard/UploadModal";
import SubMenu from "@/components/SubMenu/SubMenu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { buildAccessContext, canUseFeature } from "@/lib/access";
import axios from "axios";

const recordsPerPage = 5;
const viewPDF = async (e: any) => {
  e.preventDefault();
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/openai/viewpdf`,
    { url: e.target.value },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  const popup = window.open(
    "",
    "pdfPopup",
    `width=${screen.availWidth},height=${screen.availHeight},top=0,left=0`
  );

  if (!popup) {
    alert("Popup blocked. Please enable popups for this site.");
    return;
  }

  popup.location.href = res.data.url;
};
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    dataset,
    providerData,
    analyseChart,
    allCount,
    lowRate,
    nonLowCount,
    loading,
  } = useDashboardData();
  const isAuthenticated = useAuthStore.getState().isAuthenticated();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      errorToast("Unauthorized Attempt");
      const t = setTimeout(() => router.push("/sign-in"), 1000);
      return () => clearTimeout(t);
    }

    if (!user) return;
    const accessCtx = buildAccessContext({
      isAuthenticated,
      isAdmin: user.isAdmin,
      subscriptionType: user.subscriptionType ?? null,
      subscribedAt: user.subscribedAt ?? null,
      isYearly: user.isYearly,
    });
    const uploadsEnabled = canUseFeature("useUploads", accessCtx);
    setIsDisabled(!uploadsEnabled);
  }, [isAuthenticated, user, router]);

  // ----------------------------
  // Derived dataset (pagination + search)
  // ----------------------------
  const filteredDataset = dataset.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchKey.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredDataset.length / recordsPerPage);
  const paginatedData = filteredDataset.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col gap-4">
        {isDisabled && (
          <div className="w-full py-5 text-2xl text-center text-white bg-gray-500">
            Your subscription is disabled.
          </div>
        )}

        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-6 py-3 rounded-lg ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              disabled={isDisabled}
            >
              Upload Charts
            </button>
            <UploadModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setTimeout(() => window.location.reload(), 100);
              }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p>Total chart audited</p>
              <h2 className="text-2xl font-bold">{allCount}</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>% Clinic compliance rate</p>
              <h2 className="text-2xl font-bold">{lowRate}%</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>Non-Compliant chart</p>
              <h2 className="text-2xl font-bold">{nonLowCount}</h2>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3>Provider compliance rates</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={providerData} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3>Monthly audit trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyseChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="High"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Moderate"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Low"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Audit List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Recent Audit Lists</h3>
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-600" />
                <Input
                  placeholder="Search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Table */}
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-6">No.</th>
                  <th className="py-3 px-6">Patient</th>
                  <th className="py-3 px-6">Provider</th>
                  <th className="py-3 px-6">Audit Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">View</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(
                  ([no, patient, provider, date, status, url]) => (
                    <tr key={no} className="border-b hover:bg-blue-50">
                      <td className="py-3 px-6">{no}</td>
                      <td className="py-3 px-6">{patient}</td>
                      <td className="py-3 px-6">{provider}</td>
                      <td className="py-3 px-6">{date}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${
                            status === "Low"
                              ? "bg-green-100 text-green-700"
                              : status === "Moderate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status} Risk
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-100"
                          value={url}
                          onClick={viewPDF}
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}

"use client";
import React from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import { ArrowLeft } from "lucide-react";

export default function PatientDetail() {
  const patient = {
    name: "Tom Smith",
    dob: "Aug 4, 1964",
    gender: "Male",
    lastVisit: "Oct 7, 2025",
    totalAudits: "Total Audits",
    compliantChart: "Compliant Chart",
    complianceRate: "Corvolance Tutti 0%",
    recentSubmissions: "Recent Submissions",
  };

  const recentSubmissions = [
    { date: "Oct 5, 2025", type: "Lab Test", status: "Completed" },
    { date: "Oct 3, 2025", type: "Prescription", status: "Pending" },
  ];

  function DetailItem({ label, value }: { label: string; value: string }) {
    return (
      <div>
        <span className="text-sm text-slate-500">{label}:</span>
        <p className="text-slate-800">{value}</p>
      </div>
    );
  }

  function Table({ children }: { children: React.ReactNode }) {
    return <table className="w-full border-collapse">{children}</table>;
  }

  function StatusBadge({ status }: { status: string }) {
    const statusColor =
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <div>
          <div className="p-6 max-w-4xl mx-auto">
            {/* Header with back button and patient information */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => (window.location.href = "/patients")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-semibold text-slate-800">
                Patient Information
              </h1>
              {/* Empty div to balance the flex layout */}
              <div className="w-10"></div>
            </div>

            {/* Patient profile card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Patient Information Section */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-center gap-4">
                  <DetailItem label="Name" value={patient.name} />
                  <DetailItem label="Date of Birth" value={patient.dob} />
                  <DetailItem label="Gender" value={patient.gender} />
                  <DetailItem label="Last Visit" value={patient.lastVisit} />
                </div>
              </div>

              {/* Compliance Section */}
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Compliance
                </h2>
                <div className="flex justify-between items-center gap-4">
                  <DetailItem label="Total Audits" value="0" />
                  <DetailItem label="Compliant Chart" value="0" />
                  <DetailItem label="Compliance Rate" value="0" />
                </div>
              </div>

              {/* Recent Submissions Section */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Recent Submissions
                </h2>
                <Table>
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-slate-500 py-2">Date</th>
                      <th className="text-left text-slate-500 py-2">Type</th>
                      <th className="text-left text-slate-500 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((submission, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 text-slate-800">
                          {submission.date}
                        </td>
                        <td className="py-3 text-slate-800">
                          {submission.type}
                        </td>
                        <td className="py-3 text-slate-800">
                          <StatusBadge status={submission.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

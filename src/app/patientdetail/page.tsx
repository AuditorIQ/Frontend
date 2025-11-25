"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import {
  ArrowLeft,
  Download,
  User,
  Calendar,
  Activity,
  TrendingUp,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

const viewpdf = async (e: any) => {
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

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateofBirth: string;
  gender: string;
  ownerId: number;
}

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function PatientDetail() {
  const [patientId, setPatientId] = useState<string>("");
  const [dataset, setDataset] = useState<
    [number, string, string, string, string, string, string][]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentpatient, setPatient] = useState<Patient | null>(null);

  const fetchPatients = async (ownerId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/patients`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result_data = await res.json();
      const patientsData = result_data.find((p: any) => p.id === ownerId);
      setPatient(patientsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const id = sessionStorage.getItem("currentPatientId");
    setPatientId(id ?? "");

    console.log(id);

    if (id) {
      fetchPatients(parseInt(id, 10));
    }
  }, []);

  useEffect(() => {
    if (!currentpatient) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const list = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const baseresult = list.data.list
          .slice()
          .reverse()
          .map((file: any, index: any) => {
            const nameWithoutExtension = file
              .replace(".pdf", "")
              .replace("reports/", "");
            const [date, cur_time, patient, provider, risk, userid] =
              nameWithoutExtension.split("_");
            return [
              index + 1,
              patient,
              provider,
              `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`,
              risk.split(" ")[0],
              file,
              userid,
            ];
          })
          .filter(
            (item: any) =>
              item[1] ===
              currentpatient.firstName + " " + currentpatient.lastName
          );
        setDataset(baseresult);
      } catch (error) {
        console.error("Failed to fetch list", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentpatient]);

  // Calculate compliance metrics
  const totalAudits = dataset.length;
  const compliantCharts = dataset.filter(
    (item) => item[4] === "Low" || item[4] === "Moderate"
  ).length;
  const complianceRate =
    totalAudits > 0
      ? ((compliantCharts / totalAudits) * 100).toFixed(1)
      : "0.0";

  // Modern Stat Card Component
  function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    trendValue,
    color = "blue",
  }: {
    icon: any;
    label: string;
    value: string;
    trend?: "up" | "down";
    trendValue?: string;
    color?: "blue" | "green" | "purple" | "orange";
  }) {
    const colorClasses = {
      blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };

    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:border-slate-300/60 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${colorClasses[color]} border group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={24} />
          </div>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                size={16}
                className={trend === "down" ? "rotate-180" : ""}
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    );
  }

  // Modern Info Badge Component
  function InfoBadge({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/60">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Icon size={20} className="text-slate-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-slate-900 font-semibold text-lg">{value}</p>
        </div>
      </div>
    );
  }

  // Modern Status Badge with Low, Moderate, High
  function StatusBadge({ status }: { status: string }) {
    const statusConfig = {
      Low: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      },
      Moderate: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: AlertTriangle,
      },
      High: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.High;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}
      >
        <Icon size={14} />
        {status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-slate-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-center text-lg">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Sidebar />
      <Card className="flex-1 p-6 flex flex-col bg-transparent border-0 shadow-none">
        <div className="flex-none mb-6">
          <SubMenu />
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full">
          {/* Modern Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => (window.location.href = "/patients")}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all duration-200 font-medium group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Patients</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Patient Profile
                </p>
                <h1 className="text-2xl font-bold text-slate-900">
                  {currentpatient?.firstName} {currentpatient?.lastName}
                </h1>
              </div>
            </div>
          </div>

          {/* Patient Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoBadge
              icon={User}
              label="Full Name"
              value={
                `${currentpatient?.firstName} ${currentpatient?.lastName}` ||
                "N/A"
              }
            />
            <InfoBadge
              icon={Calendar}
              label="Date of Birth"
              value={
                currentpatient?.dateofBirth
                  ? formatDate(new Date(currentpatient.dateofBirth))
                  : "N/A"
              }
            />
            <InfoBadge
              icon={Activity}
              label="Gender"
              value={currentpatient?.gender || "N/A"}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={FileText}
              label="Total Audits"
              value={totalAudits.toString()}
              color="blue"
            />
            <StatCard
              icon={CheckCircle2}
              label="Compliant Charts"
              value={compliantCharts.toString()}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Compliance Rate"
              value={`${complianceRate}%`}
              trend="up"
              trendValue={`+${complianceRate}%`}
              color="purple"
            />
          </div>

          {/* Recent Submissions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Recent Submissions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Track all patient audit submissions
                  </p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200">
                  {dataset.length} Records
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Risk Status
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataset.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText size={32} className="text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium">
                            No submissions found
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    dataset.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="font-medium text-slate-700">
                              {item[3]}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-slate-900 font-medium">
                            {item[2]}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={item[4]} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-all duration-200 border border-blue-200 hover:border-blue-300"
                              value={item[5]}
                              onClick={viewpdf}
                            >
                              <Eye size={16} />
                              View
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
        </div>
      </Card>
    </div>
  );
}

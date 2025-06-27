"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellIcon, Search } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import UploadModal from "@/app/dashboard/UploadModal";
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
import { errorToast, successToast } from "@/lib/toast";

let providerData: { name: string; value: number }[];
let isDisabled: boolean;
let allCount: number,
  lowCount: number,
  moderateCount: number,
  lowRate: number,
  nonLowCount: number;
const recordsPerPage = 5;

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

  window.open(
    res.data.url,
    "Audit Result",
    "toolbar=0,location=0,menubar=0,width=" +
      window.screen.availWidth +
      ",height=" +
      window.screen.availHeight
  );
};

export default function DashboardPage() {
  // Report List
  const [dataset, setDataset] = useState<
    [number, string, string, string, string, string, string][]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchkey, setSearchKey] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [analyseChart, setAnalyseChart] = useState<any[]>([]);

  const filteredDataset = dataset.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchkey.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredDataset.length / recordsPerPage);
  const paginatedData = filteredDataset.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const SearchKeyChange = (e: any) => {
    const newValue = e.target.value;
    setSearchKey(newValue);
  };

  useEffect(() => {
    // set session part & go to dashboard
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const subscription = params.get("subscriptionType");
    const subscribedAt = params.get("subscribedAt");
    const isYearly = params.get("isYearly");

    if (token && name && email && subscription && subscribedAt && isYearly) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user_name", name);
      sessionStorage.setItem("user_email", email);
      sessionStorage.setItem("subscriptionType", subscription);
      sessionStorage.setItem("subscribedAt", subscribedAt);
      sessionStorage.setItem("isYearly", isYearly);
      successToast("Successfully Signed In");
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/dashboard");
      }, 1000);
    }

    // prevent unauthorized attempt
    const authtoken = sessionStorage.getItem("token");
    if (!authtoken) {
      errorToast("Unauthorized Attempt");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
    }

    // check subscription
    const subscriptionType = sessionStorage.getItem("subscriptionType");
    const subscribestart = new Date(
      String(sessionStorage.getItem("subscribedAt"))
    );
    const duration = sessionStorage.getItem("isYearly") === "true" ? 360 : 30;
    const expireDate = new Date(subscribestart);
    expireDate.setDate(subscribestart.getDate() + duration);
    const current = new Date();

    isDisabled = subscriptionType === "FREE" || subscriptionType === null;
    if (!isDisabled && current > expireDate) isDisabled = true;

    setUserName(sessionStorage.getItem("user_name"));
    const fetchData = async () => {
      try {
        const list = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        // Set dataset
        const baseresult: [
          number,
          string,
          string,
          string,
          string,
          string,
          string,
        ][] = list.data.list
          .slice()
          .reverse()
          .map((file: string, index: number) => {
            const nameWithoutExtension = file
              .replace(".pdf", "")
              .replace("reports/", "");
            // var nameWithoutExtensionValue = { data: { value: "" } };
            // const fetchData = async () => {
            //   nameWithoutExtensionValue = await axios.post(
            //     `${process.env.NEXT_PUBLIC_API_URL}/api/openai/decrypt`,
            //     { filename: nameWithoutExtensionEncrypted }
            //   );
            // };
            // fetchData();
            // const nameWithoutExtension = nameWithoutExtensionValue.data.value;

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
            (item: any) => item[6] === sessionStorage.getItem("user_email")
          );
        const result: [
          number,
          string,
          string,
          string,
          string,
          string,
          string,
        ][] = baseresult.map((item, index) => [
          index + 1,
          item[1],
          item[2],
          item[3],
          item[4],
          item[5],
          item[6],
        ]);
        setDataset(result);

        // Compliant vs Non-Compliant
        const risks: string[] = result.map((item) => item[4]);
        allCount = risks.length;
        lowCount = risks.filter((risk) => risk === "Low").length;
        moderateCount = risks.filter((risk) => risk === "Moderate").length;
        lowRate = (lowCount * 100 + moderateCount * 100) / allCount;
        lowRate = parseFloat(lowRate.toFixed(2));
        nonLowCount = allCount - lowCount - moderateCount;

        // Provider compliance rates
        const providers: string[] = result.map((item) => item[2]);
        const frequencyMap: Record<string, number> = {};
        providers.forEach((item) => {
          frequencyMap[item] = (frequencyMap[item] || 0) + 1;
        });
        const providerrank: { name: string; value: number }[] = Object.entries(
          frequencyMap
        ).map(([key, value]) => ({
          name: key,
          value: value,
        }));
        providerData = providerrank;

        // Monthly audit trends
        const monthlytrend = result.map((item) => {
          const month = item[3].slice(0, 2);
          const severity = item[4];
          return { [month]: severity };
        });
        const monthlymap: { [month: string]: { [severity: string]: number } } =
          {};
        monthlytrend.forEach((entry) => {
          const month = Object.keys(entry)[0];
          const severity = entry[month] as "High" | "Moderate" | "Low";
          if (!monthlymap[month]) monthlymap[month] = {};

          if (!monthlymap[month][severity]) {
            monthlymap[month][severity] = 1;
          } else {
            monthlymap[month][severity]++;
          }
        });
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const monthlySummary: {
          [month: string]: {
            Total: number;
            High: number;
            Moderate: number;
            Low: number;
          };
        } = {};
        monthlytrend.forEach((entry) => {
          const month = Object.keys(entry)[0];
          const severity = entry[month] as "High" | "Moderate" | "Low";

          if (!monthlySummary[month]) {
            monthlySummary[month] = {
              Total: 0,
              High: 0,
              Moderate: 0,
              Low: 0,
            };
          }

          monthlySummary[month].Total++;
          monthlySummary[month][severity]++;
        });

        setAnalyseChart(
          Object.entries(monthlySummary).map(([month, values]) => ({
            month,
            ...values,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch list", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-4 grid gap-4">
        {/* isActivated */}
        {isDisabled && (
          <div
            style={{
              width: "100%",
              paddingTop: "20px",
              paddingBottom: "20px",
              fontSize: "25px",
              backgroundColor: "grey",
              color: "white",
              textAlign: "center",
            }}
          >
            Your subscription is disabled.
          </div>
        )}
        {/* Over the line */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-600" />
            <Input
              placeholder="Search"
              value={searchkey}
              onChange={SearchKeyChange}
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 items-center">
            <BellIcon />
            {userName}
          </div>
        </div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <div className="flex gap-2 items-center">
            <div>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className={`px-6 py-3 rounded-lg ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                style={{ cursor: "pointer" }}
                disabled={isDisabled}
                title={isDisabled ? "You need to purchase plan" : ""}
              >
                + Upload Charts
              </button>
              <UploadModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
              />
            </div>
            {/* <select className="border rounded px-2 py-1">
              <option>This month</option>
            </select> */}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p>Total chart audited</p>
              <h2 className="text-2xl font-bold">{allCount}</h2>
              <span className="text-green-600">↑ 7% vs last month</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>% Clinic compliance rate</p>
              <h2 className="text-2xl font-bold">{lowRate}%</h2>
              <span className="text-green-600">↑ {lowRate}% vs last month</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>Non-Compliant chart</p>
              <h2 className="text-2xl font-bold">{nonLowCount}</h2>
              <span className="text-red-600">↓ 1% vs last month</span>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Provider compliance rates</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={providerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Monthly audit trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyseChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="High"
                    stroke="#ef4444" // red
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Moderate"
                    stroke="#f59e0b" // yellow
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Low"
                    stroke="#10b981" // green/teal
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
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Audit Lists
              </h3>
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-600" />
                <Input
                  placeholder="Search"
                  value={searchkey}
                  onChange={SearchKeyChange}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">No.</th>
                  <th className="py-3 px-6 text-left font-medium">
                    Patient Name
                  </th>
                  <th className="py-3 px-6 text-left font-medium">Provider</th>
                  <th className="py-3 px-6 text-left font-medium">
                    Audit Date
                  </th>
                  <th className="py-3 px-6 text-left font-medium">Status</th>
                  <th className="py-3 px-6 text-left font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(
                  ([no, patient, provider, date, status, url]) => (
                    <tr
                      key={no}
                      className="border-b hover:bg-blue-50 transition duration-300 ease-in-out"
                    >
                      <td className="py-3 px-6">{no}</td>
                      <td className="py-3 px-6 font-medium text-gray-800">
                        {patient}
                      </td>
                      <td className="py-3 px-6 text-gray-600">{provider}</td>
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
                          {status}&nbsp;Risk
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-100 cursor-pointer"
                          value={url}
                          onClick={viewpdf}
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

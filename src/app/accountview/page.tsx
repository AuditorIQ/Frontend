"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { errorToast } from "@/lib/toast";
import Sidebar from "@/components/Sidebar/Sidebar";
import SubMenu from "@/components/SubMenu/SubMenu";
import {
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  Tooltip,
  PieChart,
} from "recharts";

type DatasetRow = [number, string, string, string, string, string, string];

export default function AccountViewPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [dataset, setDataset] = useState<DatasetRow[]>([]);

  const chartData = useMemo(() => {
    if (dataset.length === 0) return [];

    const count: Record<string, number> = { Low: 0, Moderate: 0, High: 0 };

    dataset.forEach((row) => {
      const risk = row[4];
      if (["Low", "Moderate", "High"].includes(risk)) {
        count[risk] += 1;
      }
    });

    return Object.keys(count).map((key) => ({
      name: key,
      value: count[key],
    }));
  }, [dataset]);

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];
  const fetchData = async () => {
    try {
      const storedUser = sessionStorage.getItem("selectedUser");
      if (!storedUser) return;

      const list = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const parsedUser = JSON.parse(storedUser);

      const baseResult: DatasetRow[] = list.data.list
        .slice()
        .reverse()
        .map((file: string, index: number) => {
          const nameWithoutExtension = file
            .replace(".pdf", "")
            .replace("reports/", "");
          const [date, _time, patient, provider, risk, userId] =
            nameWithoutExtension.split("_");

          return [
            index + 1,
            patient,
            provider,
            `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`,
            risk.split(" ")[0],
            file,
            userId,
          ];
        })
        .filter((item: string[]) => item[6] === parsedUser.email);

      const result: DatasetRow[] = baseResult.map((item, index) => [
        index + 1,
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
      ]);

      setDataset(result);
    } catch (err) {
      console.error("Failed to fetch list", err);
      errorToast("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // ✅ Group dataset by Month-Year
  const groupedDataset = useMemo(() => {
    const groups: Record<string, DatasetRow[]> = {};

    dataset.forEach((row) => {
      const date = row[3]; // MM/DD/YYYY
      const [month, , year] = date.split("/");
      const key = `${month}/${year}`; // ex: "01/2025"

      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    return groups;
  }, [dataset]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>

        <div className="flex-grow">
          <div className="p-6 space-y-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Overview
                </h2>

                <div className="h-64">
                  {chartData.length === 0 ||
                  chartData.every((d) => d.value === 0) ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          fill="#8884d8"
                          label
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex-1 overflow-y-auto">
                  <table className="min-w-full table-auto text-sm text-gray-700 text-center">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                      <tr>
                        <th className="py-3 px-6 font-medium text-center">
                          No.
                        </th>
                        <th className="py-3 px-6 font-medium text-center">
                          Patient Name
                        </th>
                        <th className="py-3 px-6 font-medium text-center">
                          Provider
                        </th>
                        <th className="py-3 px-6 font-medium text-center">
                          Audit Date
                        </th>
                        <th className="py-3 px-6 font-medium text-center">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(groupedDataset).map(
                        ([monthKey, rows]) => (
                          <>
                            {/* Month Header */}
                            <tr className="bg-gray-200">
                              <td
                                colSpan={5}
                                className="py-2 px-4 text-left font-semibold text-gray-700"
                              >
                                {monthKey}
                              </td>
                            </tr>

                            {/* Rows */}
                            {rows.map(
                              ([no, patient, provider, date, status]) => (
                                <tr
                                  key={no}
                                  className="border-b hover:bg-blue-50 transition duration-300 ease-in-out"
                                >
                                  <td className="py-3 px-6 text-center">
                                    {no}
                                  </td>
                                  <td className="py-3 px-6 text-center font-medium text-gray-800">
                                    {patient}
                                  </td>
                                  <td className="py-3 px-6 text-center text-gray-600">
                                    {provider}
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    {date}
                                  </td>
                                  <td className="py-3 px-6 text-center">
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
                                </tr>
                              )
                            )}
                          </>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

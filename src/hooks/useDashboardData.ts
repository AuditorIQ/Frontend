// src/hooks/useDashboardData.ts
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { errorToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";

type DatasetRow = [number, string, string, string, string, string, string];
type ProviderData = { name: string; value: number };
type ChartEntry = {
  month: string;
  Total: number;
  High: number;
  Moderate: number;
  Low: number;
};

export function useDashboardData() {
  const { accessToken, user } = useAuthStore();

  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [analyseChart, setAnalyseChart] = useState<ChartEntry[]>([]);
  const [allCount, setAllCount] = useState(0);
  const [lowRate, setLowRate] = useState(0);
  const [nonLowCount, setNonLowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const list = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // Dataset
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
          .filter((item: string[]) => item[6] === user.email);

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

        // Stats
        const risks = result.map((item) => item[4]);
        const total = risks.length;
        const lowCount = risks.filter((r) => r === "Low").length;
        const moderateCount = risks.filter((r) => r === "Moderate").length;
        const rate = total
          ? ((lowCount * 100 + moderateCount * 100) / total).toFixed(2)
          : "0";

        setAllCount(total);
        setLowRate(parseFloat(rate));
        setNonLowCount(total - lowCount - moderateCount);

        // Provider compliance rates
        const providerFreq: Record<string, number> = {};
        result.forEach((item) => {
          providerFreq[item[2]] = (providerFreq[item[2]] || 0) + 1;
        });
        setProviderData(
          Object.entries(providerFreq).map(([name, value]) => ({ name, value }))
        );

        // Monthly trends
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
        const monthlySummary: Record<
          string,
          { Total: number; High: number; Moderate: number; Low: number }
        > = {};

        result.forEach((item) => {
          const month = item[3].slice(0, 2); // "07"
          const severity = item[4] as "High" | "Moderate" | "Low";
          if (!monthlySummary[month]) {
            monthlySummary[month] = { Total: 0, High: 0, Moderate: 0, Low: 0 };
          }
          monthlySummary[month].Total++;
          monthlySummary[month][severity]++;
        });

        setAnalyseChart(
          Object.entries(monthlySummary)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([month, values]) => ({
              month: monthNames[parseInt(month) - 1] || month,
              ...values,
            }))
        );
      } catch (err) {
        console.error("Failed to fetch list", err);
        errorToast("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, user]);

  return {
    dataset,
    providerData,
    analyseChart,
    allCount,
    lowRate,
    nonLowCount,
    loading,
  };
}

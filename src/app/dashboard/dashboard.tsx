'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellIcon, Search } from "lucide-react";
import axios from "axios";
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
import { useEffect, useState } from 'react';
import { errorToast, successToast } from "@/lib/toast";
import Sidebar from "@/components/Sidebar";


let providerData: { name: string; value: number }[];
let monthlyTrendData: { month: string; audits: number}[];


//Upload Charts
const uploadCharts = async (e: any) => {
  e.preventDefault();
  const formData = new FormData();
  for ( let i = 0; i < e.target.files.length; i++)
    formData.append('files', e.target.files[i]);
  
  try
  {
    const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
      }
    });
    window.location.reload();
    setTimeout(() => {
      successToast("Completed!");
    }, 1000);
  }
  catch(err)
  {
    errorToast("Not Completed.");
  }
};

const viewpdf = async (e: any) => {
  e.preventDefault();
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/openai/viewpdf`, {"url": e.target.value}, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`
    }
  });

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
}

export default function DashboardPage() {

// prevent unauthorized attempt
// const router = useRouter();
// useEffect(() => {
//   const token = sessionStorage.getItem('token');
//   if (!token) {
//     router.push('/sign-in');
//   }
// }, []);

// Report List
const [dataset, setDataset] = useState<[number, string, string, string, string, string, string, string][]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [searchkey, setSearchKey] = useState('');
const [userName, setUserName] = useState<string | null>(null);
const recordsPerPage = 5;

const filteredDataset = dataset.filter(item =>
  Object.values(item).some(
    value =>
      typeof value === 'string' &&
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
}

useEffect(() => {
  setUserName(sessionStorage.getItem("user_name"));
  const fetchData = async () => {
    try {
      const list = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`, {
         headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          }
      });
      
      const result: [number, string, string, string, string, string, string, string][] = list.data.list.slice().reverse().map((file: string, index: number) => {
        const nameWithoutExtension = file.replace('.pdf', '').replace('reports/', '');
        const [date, cur_time, patient, provider, risk, userid] = nameWithoutExtension.split('_');
        return [index + 1, patient, provider, `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`, risk.split(' ')[0], file, userid];
      }).filter((item: any) => item[6] === sessionStorage.getItem("user_email"));

      setDataset(result);

      const providers: [] = list.data.list.map((file: string, index: number) => {
        const nameWithoutExtension = file.replace('.pdf', '').replace('reports/', '');
        const [date, cur_time, patient, provider, risk, userid] = nameWithoutExtension.split('_');
        return [provider];
      });

      const frequencyMap: Record<string, number> = {};

      providers.forEach(item => {
        frequencyMap[item] = (frequencyMap[item] || 0) + 1;
      });

      const providerrank: { name: string; value: number }[] = Object.entries(frequencyMap).map(
        ([key, value]) => ({
          name: key,
          value: value,
        })
      );
      providerData = providerrank;

      const monthlytrend: [] = list.data.list.map((file: string, index: number) => {
        const nameWithoutExtension = file.replace('.pdf', '').replace('reports/', '');
        const [date, curtime, patient, provider ] = nameWithoutExtension.split('_');
        return [date.slice(4,6)];
      });

      const monthlymap: Record<string, number> = {};

      monthlytrend.forEach(item => {
        monthlymap[item] = (monthlymap[item] || 0) + 1;
      });
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const monthylrank: { month: string; audits: number }[] = Object.entries(monthlymap).map(
        ([month, value]) => ({
          month: monthNames[parseInt(month, 10) - 1],
          audits: value,
        })
      );

      monthlyTrendData = monthylrank;
    }
    catch (error) {
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
        {/* Over the line */}
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-600" />
          <Input
            placeholder="Search" value={searchkey} onChange={SearchKeyChange}
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
              <input id='fileInput' type="file" multiple onChange={uploadCharts} style={{ display: 'none'}} />
              <label htmlFor='fileInput' style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", borderRadius: "6px", display: "inline-block", cursor: "pointer", fontWeight: "bold", transition: "background 0.3s ease"}}>+ Upload Charts</label>
            </div>
            <select className="border rounded px-2 py-1">
              <option>This month</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p>Total chart audited</p>
              <h2 className="text-2xl font-bold">{dataset.length}</h2>
              <span className="text-green-600">↑ 1.5% vs last month</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>% Clinic compliance rate</p>
              <h2 className="text-2xl font-bold">0%</h2>
              <span className="text-green-600">↑ 0% vs last month</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>Non-Compliant chart</p>
              <h2 className="text-2xl font-bold">0</h2>
              <span className="text-red-600">↓ 0% vs last month</span>
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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="audits" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Audit List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Audit Lists</h3>
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-600" />
                <Input
                  placeholder="Search" value={searchkey} onChange={SearchKeyChange}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">No.</th>
                  <th className="py-3 px-6 text-left font-medium">Patient Name</th>
                  <th className="py-3 px-6 text-left font-medium">Provider</th>
                  <th className="py-3 px-6 text-left font-medium">Date of Service</th>
                  <th className="py-3 px-6 text-left font-medium">Status</th>
                  <th className="py-3 px-6 text-left font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(([no, patient, provider, date, status, url]) => (
                  <tr key={no} className="border-b hover:bg-blue-50 transition duration-300 ease-in-out">
                    <td className="py-3 px-6">{no}</td>
                    <td className="py-3 px-6 font-medium text-gray-800">{patient}</td>
                    <td className="py-3 px-6 text-gray-600">{provider}</td>
                    <td className="py-3 px-6">{date}</td>
                    <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        status === 'Low'
                          ? 'bg-green-100 text-green-700'
                          : status === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {status}&nbsp;Risk
                    </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-100" value={url} onClick={viewpdf}>
                        View Result
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                  }`}
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

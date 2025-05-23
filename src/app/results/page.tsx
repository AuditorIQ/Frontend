'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import axios from "axios";
import Sidebar from '@/components/Sidebar/Sidebar';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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


export default function reports() {
  const [dataset, setDataset] = useState<[number, string, string, string, string, string, string][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchkey, setSearchKey] = useState('');
  const recordsPerPage = 25;

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
    // prevent unauthorized attempt
  const authtoken = sessionStorage.getItem('token');
  if (!authtoken) {
    window.location.href = '/sign-in';
  }

  const fetchData = async () => {
    try {
      const list = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/list`, {
         headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          }
      });
      
      // Set dataset
      const baseresult: [number, string, string, string, string, string, string][] = list.data.list.slice().reverse().map((file: string, index: number) => {
        const nameWithoutExtension = file.replace('.pdf', '').replace('reports/', '');
        const [date, cur_time, patient, provider, risk, userid] = nameWithoutExtension.split('_');
        return [index + 1, patient, provider, `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`, risk.split(' ')[0], file, userid];
      }).filter((item: any) => item[6] === sessionStorage.getItem("user_email"));

      const result: [number, string, string, string, string, string, string][] = baseresult.map(
        (item, index) => [index + 1, item[1], item[2], item[3], item[4], item[5], item[6]]
      );
      setDataset(result);

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
      <Card className="flex-1 p-4 grid gap-4">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Audit List</h3>
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
    </div>
  );
}

'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { errorToast } from "@/lib/toast";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";

let mysubscriptionType =
{
  isEnabled: false,
  name: "",
  licenseType: "",
  licenseStatus: "Disabled",
  startDate: "",
  endDate: ""
};

const page = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$99",
      yearlyPrice: "$999",
      cardStyle: "bg-white",
      buttonStyle: "bg-blue-500 text-white",
      highlight: true,
      features: [
        "Up to 50 chart audits/month",
        "1 provider license",
        "Access to MAC-based LCD/NCD audits",
        "Audit reports in PDF",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      price: "$249",
      yearlyPrice: "$2,499",
      cardStyle: "bg-white",
      buttonStyle: "bg-blue-700 text-white",
      highlight: true,
      features: [
        "Up to 200 chart audits/month",
        "3 provider licenses",
        "MAC & Medicare rules engine",
        "Real-time audit feedback",
        "Dashboard analytics",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "$500",
      yearlyPrice: "$5,000",
      cardStyle: "bg-white",
      buttonStyle: "bg-blue-900 text-white",
      highlight: true,
      features: [
        "Unlimited audits",
        "Unlimited provider licenses",
        "Dedicated account manager",
        "Custom compliance reporting",
        "API access",
        "SLA backed support",
      ],
    },
  ];

  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  const subscribePlan = async (plan: string) => {
    sessionStorage.setItem("subscriptionType",plan);
    sessionStorage.setItem("isYearly", String(isYearly));
    sessionStorage.setItem("subscribedAt",new Date(Date.now()).toISOString());
    
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/order-payment`, { plan: plan.toLowerCase(), isYearly });
    window.location.href = res.data.checkoutUrl;
  };
  const cancelSubscription = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/cancelsubscription`, {email: sessionStorage.getItem("user_email")},
        { headers: {
          token: sessionStorage.getItem("token")
        }
    });
      setTimeout(() => {
        window.location.reload();
      }, 100);
      sessionStorage.setItem('subscriptionType', "FREE");
      sessionStorage.setItem('isYearly', "false");
      sessionStorage.setItem('subscribedAt', "");

    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    mysubscriptionType.name = sessionStorage.getItem("user_name") || "";
    mysubscriptionType.licenseType = sessionStorage.getItem("subscriptionType") || "FREE";
    if (mysubscriptionType.licenseType !== "FREE")
    {
    const startDate = new Date(sessionStorage.getItem('subscribedAt') || "");
    mysubscriptionType.startDate = startDate.toISOString().split("T")[0];
    const isYearly = sessionStorage.getItem('isYearly');
    if (isYearly === "true")
    {
      startDate.setFullYear(startDate.getFullYear()+1);
      mysubscriptionType.endDate = startDate.toISOString().split("T")[0];
    }
    else
    {
      startDate.setMonth(startDate.getMonth()+1);
      mysubscriptionType.endDate = startDate.toISOString().split("T")[0];
    }

    if (new Date(startDate).getTime() > Date.now())
    {
      mysubscriptionType.isEnabled = true;
      mysubscriptionType.licenseStatus = "Active"
    }
    else
    {
      mysubscriptionType.isEnabled = false;
      mysubscriptionType.licenseStatus = "Disabled"
    }
  }

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('subscriptionType');
      setSubscriptionType(stored);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 grid gap-4"><div className="py-12">
      {/* Current Plan */}
      {mysubscriptionType.licenseType !== "FREE" && (<div className="p-6 overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 font-semibold text-gray-700">User Details</th>
            <th className="text-left p-3 font-semibold text-gray-700">License Type</th>
            <th className="text-left p-3 font-semibold text-gray-700">License Status</th>
            <th className="text-left p-3 font-semibold text-gray-700">Start Date</th>
            <th className="text-left p-3 font-semibold text-gray-700">End Date</th>
          </tr>
        </thead>
        <tbody>
            <tr className="border-t border-gray-200">
              <td className="p-3">{mysubscriptionType.name}</td>
              <td className="p-3">{mysubscriptionType.licenseType}</td>
              <td className="p-3">
                <span
                  className={`inline-block px-2 py-1 text-sm font-medium rounded ${
                    mysubscriptionType.licenseStatus === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {mysubscriptionType.licenseStatus}
                </span>
              </td>
              <td className="p-3">{mysubscriptionType.startDate}</td>
              <td className="p-3">{mysubscriptionType.endDate}</td>
              <td><button className="btn btn-danger" style={{ color: "red"}} onClick={cancelSubscription}>Cancel</button></td>
            </tr>
        </tbody>
      </table>
    </div>)}
      {/* Billing Toggle */}
      <div className="flex justify-center items-center mb-10">
        <div className="flex items-center gap-4">
          <span className={isYearly ? "text-gray-400" : "text-blue-900 font-semibold"}>Pay Monthly</span>
          <div
            className="w-16 h-8 bg-blue-200 rounded-full p-1 cursor-pointer flex items-center transition duration-300"
            onClick={() => setIsYearly(!isYearly)}
          >
            <div
              className={`w-6 h-6 bg-blue-900 rounded-full shadow-md transform transition-transform duration-300 ${
                isYearly ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </div>
          <span className={isYearly ? "text-blue-900 font-semibold" : "text-gray-400"}>Pay Yearly</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 px-6 mx-auto" style={{ paddingLeft: "11%", paddingRight: "11%" }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 m-5 text-left shadow ${plan.cardStyle} ${
              plan.highlight ? "scale-105 border-4 border-blue-300" : ""
            } transition-transform duration-300`}
          >
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">
              {isYearly ? plan.yearlyPrice : plan.price}
              <span className="text-sm font-normal">/ {isYearly ? "Year" : "Month"}</span>
            </p>
            <ul className="space-y-2 text-sm">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-blue-500">✔</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
  disabled={mysubscriptionType.isEnabled === true}
  className={`mt-4 w-full py-2 rounded-md text-white transition ${
mysubscriptionType.isEnabled === false
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-gray-400 cursor-not-allowed'
  }`} onClick={() => subscribePlan(plan.name)}
>
  Subscribe
</button>
          </div>
        ))}
      </div>
    </div></Card>
    </div>
    
  );
};

export default page;

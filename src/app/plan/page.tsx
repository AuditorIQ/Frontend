"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";
import { useAuthStore } from "@/stores/useAuthStore";

type LicenseInfo = {
  status: "Active" | "Expired";
  startDate: string;
  endDate: string;
};

function calculateLicenseStatus(
  userSubscribedAt: string | null | undefined,
  userIsYearly: boolean | undefined
): LicenseInfo | null {
  if (!userSubscribedAt) return null;
  const subscribedDate = new Date(userSubscribedAt);
  const now = new Date();

  const expiryDate = new Date(subscribedDate);
  if (userIsYearly) {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }

  return {
    status: now < expiryDate ? "Active" : "Expired",
    startDate: subscribedDate.toISOString().split("T")[0],
    endDate: expiryDate.toISOString().split("T")[0],
  };
}

const page = () => {
  // Zustand hooks at the top level
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);
  const userName = user?.name;
  const [licenseType, setLicenseType] = useState<string>("FREE");
  const [billingMode, setBillingMode] = useState<string | null>("SUBSCRIPTION");
  const [userSubscribedAt, setUserSubscribedAt] = useState<string | null>(null);
  const [userIsYearly, setUserIsYearly] = useState<boolean>(false);
  const [usersBillingMode, setUsersBillingMode] = useState<string>("-");
  const userEmail = user?.email;
  const isAdmin = !!user?.isAdmin;

  const [isYearly, setIsYearly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalPlan, setShowModalPlan] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState("");
  const [licenseInfo, setLicenseInfo] = useState<{
    status: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const plans = [
    {
      name: "STARTER",
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
      name: "PROFESSIONAL",
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
      name: "ENTERPRISE",
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

  const subscribePlan = async (plan: string) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-checkout-session`,
      {
        plan: plan.toLowerCase(),
        isYearly,
        email: userEmail,
        billingMode,
      }
    );
    window.location.href = res.data.checkoutUrl;
  };

  const cancelSubscription = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/cancelsubscription`,
        { email: userEmail },
        {
          headers: {
            token: sessionStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      successToast(res.data.message);
    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
      setTimeout(() => {}, 1000);
    }
    setShowModal(false);
  };

  const hasHydrated = useAuthStore.persist.hasHydrated?.() ?? true;

  if (!hasHydrated) return null;

  useEffect(() => {
    try {
      const res = axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        { email: userEmail }
      );
      res.then((res) => {
        setUserSubscribedAt(res.data.subscribedAt);
        setUserIsYearly(res.data.isYearly);
        setLicenseType(res.data.subscriptionType);
        res.data.billingMode === "ONE_TIME"
          ? setUsersBillingMode("ONE TIME")
          : setUsersBillingMode(res.data.billingMode);
      });
    } catch (error) {
      console.log(error);
    }
    const info = calculateLicenseStatus(userSubscribedAt, userIsYearly);
    setLicenseInfo(info);
  }, [userSubscribedAt, userIsYearly]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <div className="flex-grow">
          {/* Current Plan */}
          {licenseType !== "FREE" && (
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      User Name
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      License Type
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      License Status
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Start Date
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      End Date
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Billing Mode
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-3">{userName}</td>
                    <td className="p-3">{licenseType}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded ${
                          licenseInfo?.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {licenseInfo?.status}
                      </span>
                    </td>
                    <td className="p-3">{licenseInfo?.startDate}</td>
                    <td className="p-3">{licenseInfo?.endDate}</td>
                    <td className="p-3">{usersBillingMode}</td>
                    {licenseInfo?.status === "Active" &&
                      usersBillingMode === "SUBSCRIPTION" && (
                        <td>
                          <button
                            className="btn btn-danger"
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => setShowModal(true)}
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    {showModal && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: 30,
                            borderRadius: 10,
                            width: "400px",
                            textAlign: "center",
                          }}
                        >
                          <h3>Are you sure you want to cancel?</h3>
                          <div
                            style={{
                              marginTop: 20,
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <button
                              onClick={cancelSubscription}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                              style={{ width: "40%", cursor: "pointer" }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setShowModal(false)}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                              style={{ width: "40%", cursor: "pointer" }}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {/* Toggle Buttons  */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-8 md:gap-16">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center gap-4">
              <span
                className={
                  isYearly ? "text-gray-400" : "text-blue-900 font-semibold"
                }
              >
                Pay Monthly
              </span>
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
              <span
                className={
                  isYearly ? "text-blue-900 font-semibold" : "text-gray-400"
                }
              >
                Pay Yearly
              </span>
            </div>

            {/* Billing Type Toggle */}
            <div className="flex items-center gap-4">
              <span
                className={
                  billingMode === "SUBSCRIPTION"
                    ? "text-blue-900 font-semibold"
                    : "text-gray-400"
                }
              >
                Subscription
              </span>
              <div
                className="w-16 h-8 bg-blue-200 rounded-full p-1 cursor-pointer flex items-center transition duration-300"
                onClick={() =>
                  setBillingMode(
                    billingMode === "SUBSCRIPTION" ? "ONE_TIME" : "SUBSCRIPTION"
                  )
                }
              >
                <div
                  className={`w-6 h-6 bg-blue-900 rounded-full shadow-md transform transition-transform duration-300 ${
                    billingMode === "ONE_TIME"
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                />
              </div>
              <span
                className={
                  billingMode === "ONE_TIME"
                    ? "text-blue-900 font-semibold"
                    : "text-gray-400"
                }
              >
                One-time
              </span>
            </div>
          </div>
          {/* Pricing Cards */}
          <div
            className="grid md:grid-cols-3 gap-6 px-6 mx-auto"
            style={{ paddingLeft: "11%", paddingRight: "11%" }}
          >
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
                  <span className="text-sm font-normal">
                    / {isYearly ? "Year" : "Month"}
                  </span>
                </p>
                <button
                  style={{ cursor: "pointer" }}
                  disabled={
                    licenseType?.toLowerCase() === plan.name.toLowerCase()
                  }
                  className={`mb-4 w-full py-2 rounded-md text-white transition ${
                    licenseType?.toLowerCase() !== plan.name.toLowerCase()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (
                      licenseType?.toLowerCase() !== plan.name.toLowerCase()
                    ) {
                      setUpgradePlan(plan.name);
                      setShowModalPlan(true);
                    }
                  }}
                >
                  {billingMode === "ONE_TIME" ? "Purchase" : "Subscribe"}
                </button>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-blue-500">✔</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {showModalPlan && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: 30,
                  borderRadius: 10,
                  width: "400px",
                  textAlign: "center",
                }}
              >
                <h3>Are you sure you want to upgrade?</h3>
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowModalPlan(false);
                      subscribePlan(upgradePlan);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    style={{ width: "40%", cursor: "pointer" }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowModalPlan(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    style={{ width: "40%", cursor: "pointer" }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default page;

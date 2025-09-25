"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import useSignupFormStore from "@/stores/authStore";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface ChooseSubscriptionProps {
  formData: any;
  updateFormData: (data: any) => void;
  onBack: () => void;
}

export function ChooseSubscription({
  formData,
  updateFormData,
  onBack,
}: ChooseSubscriptionProps) {
  const router = useRouter();

  // Local state for UI
  const [selectedPlan, setSelectedPlan] = useState(
    formData.subscriptionType || "FREE"
  );
  const [yearly, setYearly] = useState(formData.isYearly || false);
  const [billingMode, setBillingMode] = useState(
    formData.billingMode || "SUBSCRIPTION"
  );

  const {
    setSubscriptionType,
    setisYearly,
    setsubscribedAt,
    setbillingMode: setStoreBillingMode,
    name,
    email,
    password,
    practiceName,
    zipCode,
    subscriptionType,
    providers,
  } = useSignupFormStore();

  // Default billing mode on mount
  useEffect(() => {
    setBillingMode("SUBSCRIPTION");
    setStoreBillingMode("SUBSCRIPTION");
  }, [setStoreBillingMode]);

  const plans = [
    {
      name: "STARTER",
      price: "$99",
      yearlyPrice: "$1,000",
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
      yearlyPrice: "$2,500",
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

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setSubscriptionType(plan);
    updateFormData({ ...formData, subscriptionType: plan });
  };

  const handleToggleYearly = () => {
    setYearly(!yearly);
  };

  const handleToggleBillingMode = () => {
    const newMode =
      billingMode === "SUBSCRIPTION" ? "ONE_TIME" : "SUBSCRIPTION";
    //    console.log(newMode);
    setBillingMode(newMode);
    setStoreBillingMode(newMode);
  };

  const connectStripe = async () => {
    if (selectedPlan === "FREE") {
      errorToast("Choose a plan!");
      return;
    }

    const isoString = new Date().toISOString();

    // Update local state and store
    const updatedData = {
      ...formData,
      subscriptionType: selectedPlan,
      isYearly: yearly,
      billingMode,
      subscribedAt: isoString,
    };
    useAuthStore.getState().setFormData(updatedData);
    updateFormData(updatedData);
    setisYearly(yearly);
    setsubscribedAt(isoString);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-checkout-session`,
        {
          plan: selectedPlan.toLowerCase(),
          isYearly: yearly,
          email: formData.email,
          billingMode,
        }
      );
      window.location.href = res.data.checkoutUrl;
    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Failed to connect to Stripe");
    }
  };

  const handleSubmitFree = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          practiceName,
          zipCode,
          subscriptionType: "FREE",
          isYearly: yearly,
          billingMode,
          subscribedAt: null,
          providers: {
            create: providers.map((provider: any) => ({
              firstName: provider.firstName,
              lastName: provider.lastName,
              credentials: provider.credentials,
              npiNumber: String(provider.npiNumber),
              zipCode: provider.zipCode,
              specialty: provider.specialty,
            })),
          },
        }
      );

      if (res?.data?.success) {
        successToast("Successfully signed up");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      }
    } catch (err: any) {
      errorToast(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Choose Your Subscription</h2>
      </div>

      {/* Billing Cycle & Type Toggle */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-8 md:gap-16">
        <div className="flex items-center gap-4">
          <span
            className={
              !yearly ? "text-blue-900 font-semibold" : "text-gray-400"
            }
          >
            Pay Monthly
          </span>
          <div
            className="w-16 h-8 bg-blue-200 rounded-full p-1 cursor-pointer flex items-center transition duration-300"
            onClick={handleToggleYearly}
          >
            <div
              className={`w-6 h-6 bg-blue-900 rounded-full shadow-md transform transition-transform duration-300 ${
                yearly ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </div>
          <span
            className={yearly ? "text-blue-900 font-semibold" : "text-gray-400"}
          >
            Pay Yearly
          </span>
        </div>

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
            onClick={handleToggleBillingMode}
          >
            <div
              className={`w-6 h-6 bg-blue-900 rounded-full shadow-md transform transition-transform duration-300 ${
                billingMode === "ONE_TIME" ? "translate-x-8" : "translate-x-0"
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

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg p-4 ${selectedPlan === plan.name ? "bg-white ring-2 ring-[#0a2463] border-blue-500" : "bg-[#EBF9FF]"}`}
            onClick={() => handleSelectPlan(plan.name)}
          >
            <div className="p-3 rounded-t-lg">
              <h3 className="font-bold">{plan.name}</h3>
            </div>

            <div className="p-3">
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold">
                  {yearly ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-gray-500 text-sm">
                  {yearly ? "/Year" : "/Month"}
                </span>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check
                      size={30}
                      className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          className="bg-[#0a2463] min-w-xs max-w-sm"
          onClick={connectStripe}
        >
          Continue to Pay
        </Button>
        <Button
          className="bg-[#0a2463] min-w-xs max-w-sm"
          onClick={handleSubmitFree}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}

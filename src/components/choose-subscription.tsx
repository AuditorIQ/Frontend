"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import useSignupFormStore from "@/stores/authStore";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

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
  const [selectedPlan, setSelectedPlan] = useState(
    formData.subscriptionType || "FREE"
  );
  const {
    setSubscriptionType,
    name,
    email,
    password,
    practiceName,
    zipCode,
    providerLicenseNo,
    subscriptionType,
    profilePicUrl,
    providers,
  } = useSignupFormStore();
  
  const router = useRouter();

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    updateFormData({ subscriptionType: plan });
  };

  const connectStripe = async () => {
    sessionStorage.setItem("formData",JSON.stringify(formData));
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/order-payment`, { plan: selectedPlan.toLowerCase() });
    window.location.href = res.data.checkoutUrl;
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, {
        name,
        email,
        password,
        practiceName,
        zipCode,
        providerLicenseNo,
        subscriptionType: selectedPlan,
        providers: { create: providers.map((provider: any, index: number) => ({
          id: (Date.now()+index),
          name: provider.name,
          npiNumber: provider.npiNumber,
        }))},
      });
  
      if (res?.data?.success) {
        successToast("Successfully signed up");
  
        setTimeout(() => {
          router.push('/sign-in');
        }, 100); // small delay just in case
      }
    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Choose Your Subscription</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Starter Plan */}
        <div
          className={` rounded-lg p-4 ${
            selectedPlan === "STARTER" ? "bg-primary ring-2 ring-[#0a2463]" : "bg-[#EBF9FF]"
          }`}
          onClick={() => handleSelectPlan("STARTER")}
        >
          <div className="p-3 rounded-t-lg">
            <h3 className="font-bold">Starter</h3>
            <p className="text-xs text-gray-600">
              For solo providers or small clinics
            </p>
          </div>

          <div className="p-3">
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">$99</span>
              <span className="text-gray-500 text-sm">/Month</span>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Up to 50 chart audits/month</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">1 provider license</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1 shrink-0"
                />
                <span className="text-sm">
                  Access to MAC-based LCD/NCD audits
                </span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Audit reports in PDF</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Email Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Professional Plan */}
        <div
          className={` rounded-lg p-4 ${
            selectedPlan === "PROFESSIONAL" ? "bg-primary ring-2 ring-[#0a2463]" : "bg-[#EBF9FF]"
          }`}
          onClick={() => handleSelectPlan("PROFESSIONAL")}
        >
          <div
            className={`#${
              selectedPlan === "professional" ? "bg-[#1a3573]" : "bg-[#f0f7ff]"
            } p-3 rounded-t-lg`}
          >
            <h3 className="font-bold">Professional</h3>
            <p
              className={`text-xs #${
                selectedPlan === "professional"
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              For growing practices
            </p>
          </div>

          <div className="p-3">
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">$249</span>
              <span
                className={`#${
                  selectedPlan === "professional"
                    ? "text-gray-300"
                    : "text-gray-500"
                } text-sm`}
              >
                /Month
              </span>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check
                  size={30}
                  className={`bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463] "
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">Up to 200 chart audits/month</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className={` bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463]"
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">3 provider licenses</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className={` bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463]"
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">MAC & Medicare rules engine</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className={` bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463]"
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">Real-time audit feedback</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className={` bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463]"
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">Dashboard analytics</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className={` bg-[#C9F0FF] #${
                    selectedPlan === "professional"
                      ? "text-white"
                      : "text-[#0a2463]"
                  } mr-2 mt-0.5 rounded-full p-1 text-[#0a2463]`}
                />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div
          className={` rounded-lg p-4 ${
            selectedPlan === "ENTERPRISE" ? "bg-primary ring-2 ring-[#0a2463]" : "bg-[#EBF9FF]"
          }`}
          onClick={() => handleSelectPlan("ENTERPRISE")}
        >
          <div className="p-3 rounded-t-lg">
            <h3 className="font-bold">Enterprise</h3>
            <p className="text-xs text-gray-600">
              For larger clinics or hospitals
            </p>
          </div>

          <div className="p-3">
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">$100</span>
              <span className="text-gray-500 text-sm">/Month</span>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Unlimited audits</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Unlimited provider licenses</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">Custom compliance reporting</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">API access</span>
              </li>
              <li className="flex items-start">
                <Check
                  size={30}
                  className="text-[#0a2463] mr-2 mt-0.5 bg-[#C9F0FF] rounded-full p-1"
                />
                <span className="text-sm">SLA backed support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button className="bg-[#0a2463] min-w-xs max-w-sm" onClick={() => connectStripe()}>
          Continue to Pay
        </Button>
        <button onClick={() => handleSubmit()} className="bg-[#ffffff] min-w-xs max-w-sm">
          Skip for now
        </button>
      </div>
    </div>
  );
}
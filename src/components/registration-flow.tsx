"use client";

import { useState } from "react";
import { CreateAccount } from "@/components/create-account";
import { PracticeInformation } from "@/components/practice-information";
import { AddProviders } from "@/components/add-providers";
import { ChooseSubscription } from "@/components/choose-subscription";
import useSignupFormStore from "@/stores/authStore";

export function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    practiceName: "",
    zipCode: "",
    providerLicenseNo: "",
    providers: [],
    subscriptionType: "",
  });


  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <>
      <div className="w-full  mx-auto p-6 flex flex-col items-center justify-center h-screen">
        <div className="w-full">
          <div className="text-center mb-6">
          <center><img style={{ width: "200px"}} src= "logo_asset.svg" /></center>
          </div>

          {step === 1 && (
            <CreateAccount
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}

          {step === 2 && (
            <PracticeInformation
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 3 && (
            <AddProviders
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 4 && (
            <ChooseSubscription
              formData={formData}
              updateFormData={updateFormData}
              onBack={prevStep}
            />
          )}
        </div>
        <div className="bg-gray-300 h-1 rounded-full min-w-xs max-w-sm mx-auto mt-9">
          <div
            className="bg-primary h-full rounded-full"
            style={{
              width: `${(step / 4) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

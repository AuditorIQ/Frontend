"use client";

import { useState, useEffect } from "react";
import { CreateAccount } from "@/app/(auth)/sign-up/create-account";
import { PracticeInformation } from "@/app/(auth)/sign-up/practice-information";
import { AddProviders } from "@/app/(auth)/sign-up/add-providers";
import { ChooseSubscription } from "@/app/(auth)/sign-up/choose-subscription";
import useSignupFormStore from "@/stores/authStore";

type RegistrationFlowProps = {
  curstep?: string | number;
  curname?: string;
  curemail?: string;
};

export const RegistrationFlow = ({ curstep = 1, curname="", curemail="" }) => {
  const [step, setStep] = useState(curstep);

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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: curname,
      email: curemail,
      password: "1234567890"
    }));
  }, [curname, curemail]);

  return (
    <>
      <div className="bg-[url('/register-background.jpg')] w-full  mx-auto p-6 flex flex-col items-center justify-center h-screen">
        <div className="bg-white" style={{border: "1px solid black"}}>
          <div className="text-center mb-6">
          <button onClick={() => window.location.href="/"}><img style={{ width: "200px", paddingTop: "50px"}} src= "logo_asset.svg" /></button>
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
};

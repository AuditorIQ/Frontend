"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useSignupFormStore from "@/stores/authStore";

interface PracticeInformationProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PracticeInformation({
  formData,
  updateFormData,
  onNext,
  onBack,
}: PracticeInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setPracticeName, setZipCode } = useSignupFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.practiceName)
      newErrors.practiceName = "Practice name is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setZipCode(formData.zipCode);
      setPracticeName(formData.practiceName);
      onNext();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-md mx-auto ">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Add Practice</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="practiceName">Practice Name</Label>
          <Input
            id="practiceName"
            type="text"
            placeholder="Enter your practice name"
            value={formData.practiceName}
            onChange={(e) => updateFormData({ practiceName: e.target.value })}
          />
          {errors.practiceName && (
            <p className="text-red-500 text-xs">{errors.practiceName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter your zip code"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs">{errors.zipCode}</p>
          )}
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="providerLicenseNo">Number of provider license</Label>
          <Input
            id="providerLicenseNo"
            type="text"
            placeholder="Enter your license number"
            value={formData.providerLicenseNo}
            onChange={(e) =>
              updateFormData({ providerLicenseNo: e.target.value })
            }
          />
          {errors.providerLicenseNo && (
            <p className="text-red-500 text-xs">{errors.providerLicenseNo}</p>
          )}
        </div> */}

        <div className="flex flex-row justify-between gap-4 w-full">
          <Button
            type="button"
            onClick={onBack}
            className="w-1/2 bg-[#0a2463] cursor-pointer"
          >
            Back
          </Button>
          <Button type="submit" className="w-1/2 bg-[#0a2463] cursor-pointer">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

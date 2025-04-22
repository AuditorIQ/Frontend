"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import useSignupFormStore from "@/stores/authStore";

interface CreateAccountProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

export function CreateAccount({
  formData,
  updateFormData,
  onNext,
}: CreateAccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setName, setEmail, setPassword } = useSignupFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!acceptTerms)
      newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setName(formData.name);
      setEmail(formData.email);
      setPassword(formData.password);
      onNext();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-md mx-auto ">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-3">Create Your Account</h2>
        <p className="text-gray-500 text-sm">
          Welcome! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Signup with Google
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 flex-grow"></div>
          <div className="mx-4 text-gray-500 text-sm">or</div>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className="px-6 py-5"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            className="px-6 py-5"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              className="px-6 py-5"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Retype Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              className="px-6 py-5"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Retype your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept all{" "}
            <Link href="#" className="text-[#0a2463] hover:underline">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

        <Button
          type="submit"
          className="w-full bg-[#0a2463] min-w-xs max-w-sm mx-auto"
        >
          Next
        </Button>

        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="#" className="text-[#0a2463] hover:underline">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}

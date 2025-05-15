"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { errorToast, successToast } from "@/lib/toast";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem('token',"");
    sessionStorage.setItem('user_email',"");
    sessionStorage.setItem('user_name',"");
  });

  // Handle form submission and registration process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically submit the complete registration data
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/signin`,
        {
          email,
          password,
        }
      );
      if (res?.data?.success) successToast("Successfully signed In");
      // save token to the storage
      sessionStorage.setItem('token', res?.data?.data.accessToken);
      sessionStorage.setItem('user_email', res?.data?.data.user.email);
      sessionStorage.setItem('user_name', res?.data?.data.user.name);
      // move to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      errorToast(error?.response?.data?.message || "Something went wrong");
    }
    // Redirect to dashboard or confirmation page
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full h-full max-w-6xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="text-center mb-28">
            <center><img style={{ width: "200px"}} src= "logo_asset.svg" /></center>
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-center mb-2">
              Get Started!
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to continue to your account
            </p>

            <Button
              variant="outline"
              className="w-full mb-6 relative"
              onClick={() => {window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;}}
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
              Sign in with Google
            </Button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <span className="text-gray-400">👁️</span>
                      ) : (
                        <span className="text-gray-400">👁️</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-navy-800 hover:bg-navy-900 cursor-pointer"
                  style={{ backgroundColor: "#0a2463" }}
                >
                  Sign in
                </Button>
              </div>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="#hidden md:block md:w-1/2 bg-gray-100">
          <Image
            src="firstscreen.svg" alt="Healthcare professional with patient"
            width={800}
            height={900}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

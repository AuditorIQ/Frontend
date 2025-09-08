"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ContactForm from "../../components/ContactForm/ContactForm";
import FaqAccordion from "../../components/FaqAccordion/FaqAccordion";
import { Mail, MapPin, Phone } from "lucide-react";
import "@/components/RegisterButton.css";
import "@/components/ContactButton.css";
import Footer from "@/components/Footer/Footer";
import { useAuthStore } from "@/stores/useAuthStore";

export default function page() {
   const username = useAuthStore((s) => s.user?.name);
  const token = useAuthStore((s) => s.accessToken);
  const showRegisterButton = !token;
  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow-sm"
        style={{ paddingLeft: "15%", paddingRight: "15%" }}
      >
        <button
          onClick={() => (window.location.href = "/")}
          style={{ cursor: "pointer" }}
        >
          <img src="logo_asset.svg" style={{ width: "200px" }} />
        </button>
        {/* Register Button */}
        {showRegisterButton && (
          <button
            className="register-button"
            onClick={() => (window.location.href = "/sign-in")}
          >
            <span>Sign In</span>
            <img src="nextBtn.svg" />
          </button>
        )}
        {/* Dashboard Button */}
        {!showRegisterButton && (
          <button
            className="register-button"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <span>{username}</span>
            <img src="nextBtn.svg" />
          </button>
        )}
      </nav>
      <div
        style={{
          background:
            "linear-gradient(to bottom, white 0%, rgb(200, 225, 255) 50%, white 100%)",
        }}
      >
        <div className="justify-center pt-20 pb-20 space-x-4 m-6">
          <h1 className="text-3xl font-bold text-center mb-2">
            Connect with{" "}
            <button style={{ marginLeft: "15px" }}>
              <img src="logo_asset.svg" style={{ width: "200px" }} />
            </button>
          </h1>
          <p className="text-center">
            What are you waiting for; Click that submit button!
          </p>
        </div>
        <main className="flex items-center justify-center to-blue-50 p-6">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <Image
                src="contact-us.svg"
                alt="Contact illustration"
                width={500}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-1/2">
              <ContactForm />
            </div>
          </div>
        </main>
      </div>
      <div
        className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-white shadow rounded-2xl space-x-4"
        style={{ paddingLeft: "20%", paddingRight: "20%" }}
      >
        <div className="flex items-center gap-4">
          <MapPin className="text-blue-600" />
          <div>
            <p className="text-lg font-medium">18142 Regents Square Drive</p>
            <p className="text-lg">Tampa, FL 33647</p>
            <p className="text-lg text-gray-500">United States</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="text-blue-600" />
          <p className="text-lg font-medium">1 234 567 890</p>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="text-blue-600" />
          <p className="text-lg font-medium">info@auditoriq.ai</p>
        </div>
      </div>
      <div className="justify-center space-x-4 bg-gradient-to-b from-white to-blue-50 p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          All Your Questions, Answered
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Find quick answers to the most commonly asked questions about our
          platform
        </p>
        <FaqAccordion />
      </div>
      <Footer />
    </>
  );
}

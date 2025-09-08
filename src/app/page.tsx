"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import "@/components/RegisterButton.css";
import "@/components/ContactButton.css";
import FaqAccordion from "@/components/FaqAccordion/FaqAccordion";
import Footer from "@/components/Footer/Footer";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Home() {
  // const [showRegisterButton, setShowRegisterButton] = useState(false);
  // const [username, setUsername] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    {
      title: "Intelligent Audit Automation",
      description:
        "Our AI doesn’t just check — it understands context, charts, and wound progression, just like a trained auditor.",
      icon: "features/intelligent_audit.svg", // Replace with your actual asset
    },
    {
      title: "End-to-End HIPAA Compliance",
      description:
        "Your data stays private — records are never stored post-audit. Built with compliance-first architecture.",
      icon: "features/e2e_hippa.svg",
    },
    {
      title: "MAC–Zip Code Mapping",
      description:
        "Automatically identify your regional medicare rules using your ZIP code — no guesswork.",
      icon: "features/mac_zip.svg",
    },
  ];
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

  const username = useAuthStore((s) => s.user?.name);
  const token = useAuthStore((s) => s.accessToken);

  //   console.log("haha", username, token);

  const showRegisterButton = !token;

  return (
    <div className="min-h-screen text-slate-900">
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
        <Navbar />

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
            <span>Dashboard</span>
            <img src="nextBtn.svg" />
          </button>
        )}
      </nav>
      <section
        id="home"
        className="pt-10"
        style={{
          background:
            "linear-gradient(to bottom, white 0%, rgb(200, 225, 255) 50%, white 100%)",
        }}
      >
        {/* Hero Section */}
        <section className="text-center py-20 px-6 mt-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> Medicare
            Compliance Audits, In Minutes
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Get accurate, LCD/NCD driven chart audits for wound care and beyond
            – no guesswork, no delays.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              className="contact-button flex items-center"
              href="/contact"
              style={{ border: "1px solid blue" }}
            >
              <span>Contact us</span>
              <img src="dial.svg" style={{ color: "black" }} />
            </a>
            <button
              className="register-button"
              onClick={() => (window.location.href = "/sign-up")}
            >
              <span>Get Started</span>
              <img src="nextBtn.svg" />
            </button>
          </div>
        </section>
        <center>
          <img src="dashboard.svg" />
        </center>
      </section>
      <section id="about" className="pt-10">
        {/* Services Section */}
        <section className="text-center pt-20 px-6 bg-white">
          <p className="text-sm text-blue-600 font-medium mb-2">Services</p>
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Simplify Medicare Audits
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-12">
            Save time, reduce errors, and stay compliant with smart tools
            designed for busy healthcare providers.
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mx-auto"
            style={{ paddingLeft: "20%", paddingRight: "20%" }}
          >
            {[
              {
                title: "AI Powered Chart Audits",
                desc: "Automatically analyze clinical documentation against LCD/NCD/MAC policies and get audit-ready in seconds.",
                icon: "🧠",
              },
              {
                title: "Real-Time Medicare Compliance Checks",
                desc: "Automatically analyze clinical documentation against LCD/NCD/MAC policies and get audit-ready in seconds.",
                icon: "📡",
              },
              {
                title: "Secure HIPAA-Compliance Cloud",
                desc: "Automatically analyze clinical documentation against LCD/NCD/MAC policies and get audit-ready in seconds.",
                icon: "🔒",
              },
              {
                title: "Insightful Dashboard & Reports",
                desc: "Automatically analyze clinical documentation against LCD/NCD/MAC policies and get audit-ready in seconds.",
                icon: "📊",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-blue-50 p-6 rounded-xl shadow-md text-left"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section id="features" className="pt-10">
        {/* Features Section */}
        <section className="pt-20 text-center bg-white">
          <p className="text-sm text-blue-600 font-medium mb-2">Features</p>
          <h2 className="text-3xl font-bold mb-4">
            Powerful Features that Make Compliance Simple
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mb-10">
            From automated audits to real-time insights and secure uploads —
            AuditIQ gives you the tools to stay compliant, save time, and focus
            on patient care.
          </p>
          <div
            className="grid md:grid-cols-3 gap-6 px-6 mx-auto"
            style={{ paddingLeft: "20%", paddingRight: "20%" }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <img src={f.icon} alt={f.title} className="mx-auto h-16 mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section id="pricing" className="pt-10">
        {/* Pricing Section */}
        <section className="pt-20 text-center bg-white">
          <p className="text-sm text-blue-600 font-medium mb-2">Pricing</p>
          <h2 className="text-3xl font-bold mb-4">
            Flexible Plans for Every Need
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mb-10">
            Whether you're a solo provider or managing a multi-clinic operation,
            our plans scale with your needs — no hidden fees, no surprises.
          </p>
          <div className="pt-12">
            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-10">
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
            </div>

            {/* Pricing Cards */}
            <div
              className="grid md:grid-cols-3 gap-6 px-6 mx-auto"
              style={{ paddingLeft: "20%", paddingRight: "20%" }}
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
                    className={`w-full py-2 rounded-md mb-4 ${plan.buttonStyle}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "/sign-up";
                    }}
                  >
                    Get Started Now
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
          </div>
        </section>
      </section>
      <section id="faqs" className="pt-10">
        <div
          className="space-y-16 px-8 pt-20 mx-auto"
          style={{ paddingLeft: "11%", paddingRight: "11%" }}
        >
          <section>
            <div
              className="mx-auto px-4"
              style={{ paddingLeft: "11%", paddingRight: "11%" }}
            >
              <p className="text-sm text-blue-600 font-medium mb-2 text-center">
                FAQs
              </p>
              <h2 className="text-3xl font-bold text-center mb-6">
                All Your Questions, Answered
              </h2>
              <p className="text-center text-gray-500 mb-10">
                Find quick answers to the most commonly asked questions about
                our platform
              </p>
              <FaqAccordion />
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
}

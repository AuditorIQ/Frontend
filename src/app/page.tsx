'use client';

import React, {useState} from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Navbar from "@/components/Navbar/Navbar";
import '@/components/RegisterButton/RegisterButton.css';
import '@/components/ContactButton/ContactButton.css';
import FaqAccordion from '@/components/FaqAccordion/FaqAccordion';
import Pricing from "@/components/pricing";

export default function Home() {

  const [activeSection, setActiveSection] = useState<string>('home');
  const [isMonthly, setIsMonthly] = useState(true);

  const ToggleSwitch = () => {
    const [isMonthly, setIsMonthly] = useState(true);
  
    const toggleSwitch = () => {
      setIsMonthly((prev) => !prev);
    };
  }

  const providerData = [
    { name: "Dr. Smith", value: 80 },
    { name: "Dr. Williams", value: 50 },
    { name: "Dr. Brown", value: 85 },
    { name: "Dr. Patel", value: 60 },
    { name: "Dr. Cox", value: 90 },
  ];
  
  const monthlyTrendData = [
    { month: "Jan", audits: 200 },
    { month: "Feb", audits: 240 },
    { month: "Mar", audits: 300 },
    { month: "Apr", audits: 260 },
    { month: "May", audits: 320 },
  ];

  const complianceData = [
    { provider: 'Dr. Clark', compliance: 80 },
    { provider: 'Michael Tan', compliance: 100 },
    { provider: 'Dr. Carson', compliance: 80 },
  ];
  
  const auditTrendData = [
    { month: 'Jan', audits: 20 },
    { month: 'Feb', audits: 45 },
    { month: 'Mar', audits: 30 },
    { month: 'Apr', audits: 50 },
    { month: 'May', audits: 40 },
  ];

  const testimonials = [
    {
      image: 'avatars/1.svg',
      name: 'Dr. Amanda Clark',
      title: 'Wound Care Specialist, BlueCross Clinic',
      rating: 4,
      content:
        'AuditIQ changed the way we do chart audits. What used to take hours now takes minutes — and the results are far more accurate. It’s like having a compliance expert built into our clinic.',
    },
    {
      image: 'avatars/2.svg',
      name: 'Micheal Tan',
      title: 'Clinical Compliance Manager, RM Group',
      rating: 5,
      content:
        'The platform’s insights helped us catch documentation gaps before claim denials happened. That’s a game-changer for our revenue cycle.',
    },
    {
      image: 'avatars/3.svg',
      name: 'Dr. Emily Carson',
      title: 'Medical Director, Lakeside Wound Care Center',
      rating: 4,
      content:
        'AuditIQ has completely transformed how we handle documentation reviews. What used to take hours of manual checking is now done in minutes.',
    },
  ];

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
      name: "Starter",
      price: "$99",
      features: [
        "Up to 50 chart audits/month",
        "1 provider license",
        "Access to MAC-based LCD/NCD audits",
        "Audit reports in PDF",
        "Email Support",
      ],
      buttonStyle: "border border-blue-600 text-blue-600",
      cardStyle: "bg-blue-50",
    },
    {
      name: "Professional",
      price: "$249",
      features: [
        "Up to 200 chart audits/month",
        "3 provider licenses",
        "MAC & Medicare rules engine",
        "Real-time audit feedback",
        "Dashboard analytics",
        "Priority support",
      ],
      buttonStyle: "bg-blue-100 text-blue-900",
      cardStyle: "bg-blue-900 text-white",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "$100",
      features: [
        "Unlimited audits",
        "Unlimited provider licenses",
        "Dedicated account manager",
        "Custom compliance reporting",
        "API access",
        "SLA backed support",
      ],
      buttonStyle: "border border-blue-600 text-blue-600",
      cardStyle: "bg-blue-100",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <img src="logo_asset.svg" style={{width: "200px" }} />
        <Navbar />
        {/* Register Button */}
        <button className="register-button" onClick={() => window.location.href = '/sign-up'}>
          <span>Register</span>
          <img src="nextBtn.svg" />
        </button>
      </nav>
      <section id="home" className="pt-20">
        {/* Hero Section */}
        <section className="text-center py-20 px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> Medicare Compliance Audits, In Minutes
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Get accurate, LCD/NCD driven chart audits for wound care and beyond – no guesswork, no delays.
          </p>
          <div className="flex justify-center space-x-4">
          <a className="contact-button" href="#contactus">
            <span>Contact us</span>
            <img src = "dial.svg" />
          </a>
          <button className="register-button" onClick={() => window.location.href = '/sign-in'}>
            <span>Get Started</span>
            <img src = "nextBtn.svg" />
          </button>
          </div>
        </section>
        <center><img src="dashboard.svg" /></center>
      </section>
      <section id="about" className="pt-20">
        {/* Services Section */}
        <section className="text-center py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Simplify Medicare Audits</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-12">
            Save time, reduce errors, and stay compliant with smart tools designed for busy healthcare providers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mx-auto" style={{paddingLeft: "11%", paddingRight: "11%"}}>
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
              <div key={i} className="bg-blue-50 p-6 rounded-xl shadow-md text-left">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section id="features" className="pt-20">
        {/* Features Section */}
        <section className="py-20 text-center bg-white">
          <p className="text-sm text-blue-600 font-medium mb-2">Features</p>
          <h2 className="text-3xl font-bold mb-4">Powerful Features that Make Compliance Simple</h2>
          <p className="max-w-2xl mx-auto text-gray-500 mb-10">
            From automated audits to real-time insights and secure uploads — AuditIQ gives you the tools to stay compliant, save time, and focus on patient care.
          </p>

          <div className="grid md:grid-cols-3 gap-6 px-6 mx-auto" style={{paddingLeft: "11%", paddingRight: "11%"}}>
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <img src={f.icon} alt={f.title} className="mx-auto h-16 mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section id="pricing" className="pt-20">
        {/* Pricing Section */}
      <section className="py-20 text-center bg-white">
        <p className="text-sm text-blue-600 font-medium mb-2">Pricing</p>
        <h2 className="text-3xl font-bold mb-4">Flexible Plans for Every Need</h2>
        <p className="max-w-2xl mx-auto text-gray-500 mb-10">
          Whether you're a solo provider or managing a multi-clinic operation, our plans scale with your needs — no hidden fees, no surprises.
        </p>
        <Pricing />
      </section>
      </section>
      <section id="contactus" className="pt-20">
      <div className="space-y-16 px-8 py-20 mx-auto" style={{paddingLeft: "11%", paddingRight: "11%"}}>
      <section className="text-center">
        <h2 className="text-3xl font-bold">What Our Client Are Saying</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Real stories from real users. See how AuditIQ is helping clinics save time, stay compliant, and simplify their Medicare audit process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <Card key={i} className="text-left">
              <CardContent className="space-y-4 p-6">
                <img src={t.image} />
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-sm text-gray-600">{t.title}</div>
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} fill="gold" stroke="none" className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{t.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section>
      <div className="mx-auto px-4" style={{paddingLeft: "11%", paddingRight: "11%"}}>
    <h2 className="text-3xl font-bold text-center mb-6">
      All Your Questions, Answered
    </h2>
    <p className="text-center text-gray-500 mb-10">
      Find quick answers to the most commonly asked questions about our platform
    </p>
    <FaqAccordion />
  </div>
      </section>
      </div>
      </section>
      <footer className="bg-[#0A2463] text-white">
      <div className="text-white px-8 py-12 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-0">
          Let’s Connect with us
        </h2>

        {/* Right Section - Buttons */}
        <div className="flex gap-4">
          {/* Get Started Button */}
          <button className="flex items-center gap-2 bg-blue-100 text-[#0A2463] font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition" onClick={() => window.location.href = '/sign-in'}>
            Get Started
            <span className="bg-[#0A2463] text-white p-1 rounded-full">
              <img src="nextBtn.svg" />
            </span>
          </button>

          {/* Contact Us Button */}
          <a className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#0A2463] transition" href="#contactus">
            Contact us
            <img src="dial.svg" />
          </a>
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-10">
          <div>
            <img src = "logo_footer.svg" style={{ height:"125px"}}/>
          </div>
          <div>
            <h4 className="font-semibold">Important</h4>
            <ul className="space-y-1 mt-2">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-1 mt-2">
              <li><a href="#contactus">Contact Us</a></li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2">info@auditoriq.ai<br/>+(1) 123 456 7890</p>
          </div>
        </div>
        <center><div style={{ paddingLeft: "50px", paddingBottom: "25px"}}>
          Copyright @ 2025 All rights reserved.
        </div>
        </center>
      </footer>
    </div>
  );
}
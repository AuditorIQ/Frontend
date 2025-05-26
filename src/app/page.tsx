'use client';

import React, {useEffect, useState} from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Navbar from "@/components/Navbar/Navbar";
import '@/app/RegisterButton.css';
import '@/app/ContactButton.css';
import FaqAccordion from '@/app/FaqAccordion';
import Pricing from "@/app/pricing";
import ContactForm from "@/components/ContactForm";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: 30,
  borderRadius: 10,
  width: "70%",
  textAlign: "center",
  maxHeight: "70%",
  overflowY: "auto"
};

export default function Home() {
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
   const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("user_name");
    setUsername(storedUsername);
    const token = sessionStorage.getItem("token");
    setShowRegisterButton(!token);
  });

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <button onClick={() => window.location.href="/"}><img src="logo_asset.svg" style={{width: "200px" }} /></button>
        <Navbar />
        {/* Register Button */}
        { showRegisterButton &&
          <button className="register-button" onClick={() => window.location.href = '/sign-in'}>
            <span>Sign In</span>
            <img src="nextBtn.svg" />
          </button>
        }
        {/* Dashboard Button */}
        { !showRegisterButton &&
          <button className="register-button" onClick={() => window.location.href = '/dashboard'}>
            <span>{username}</span>
            <img src="nextBtn.svg" />
          </button>
        }
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
          <a className="contact-button" href="/contact">
            <span>Contact us</span>
            <img src = "dial.svg" />
          </a>
          <button className="register-button" onClick={() => window.location.href = '/sign-up'}>
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
      <section id="articles" className="pt-20">
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
      <section id="contactus" className="pt-20" style={{alignItems: "center"}}>
      <div className="justify-center space-x-4 m-6">
        <h1 className="text-3xl font-bold text-center mb-2">Connect with  <button style={{marginLeft: "15px"}} onClick={() => window.location.href="/"}><img src="logo_asset.svg" style={{width: "200px" }} /></button></h1>
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
            <button className="flex items-center gap-2 bg-blue-100 text-[#0A2463] font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition" onClick={() => window.location.href = '/sign-up'}>
              Get Started
              <span className="bg-[#0A2463] text-white p-1 rounded-full">
                <img src="nextBtn.svg" />
              </span>
            </button>

            {/* Contact Us Button */}
            <a className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#0A2463] transition" href="/contact">
              Contact us
              <img src="dial.svg" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-10">
          <div style={{ marginRight: "125px"}}>
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
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="#" onClick={() => setShowModal(true)}>Terms & Conditions</a></li>
              <li><a href="#" onClick={() => setShowModal(true)}>Privacy Policy</a></li>
            </ul>
            {showModal && (
              <div style={overlayStyle}>
              <div style={modalStyle}>
              <h2>Terms of Policy</h2>
              <p style={{ textAlign: "left", color: "black"}}>
                  AuditorIQ Terms & Conditions
                  <br />
                  <br /> 
                  Welcome to AuditorIQ. These Terms and Conditions (“Terms”) govern your use of the AuditorIQ platform (“Service”), a HIPAA-compliant software solution that uses artificial intelligence to assist in the auditing of medical chart documentation in alignment with Medicare’s LCDs, NCDs, and CMS Articles. By registering for and using the Service, you confirm that you have read, understood, and agree to be bound by these Terms.
                  <br />
                  <br /> 
                  <b>1. Eligibility and Authority</b>
                  <br />
                  By using the Service, you represent that:
                  <br />
                  You are at least 18 years old or the legal age of majority in your jurisdiction.
                  <br />
                  You have the authority to enter into these Terms either on your own behalf or on behalf of an organization.
                  <br />
                  If acting on behalf of an organization, you warrant that you are authorized to bind that entity to these Terms.
                  <br />
                  <br />
                  <b>2. Description of Service</b>
                  <br />
                  AuditorIQ provides AI-powered documentation audits aligned with publicly available Medicare policies. The platform references applicable Local Coverage Determinations (LCDs), National Coverage Determinations (NCDs), and CMS Articles based on MAC jurisdiction and chart content.
                  <br />
                  The Service is an assistive tool only. It is not a substitute for clinical judgment, coding compliance advice, or legal counsel.
                  <br />
                  <br />
                  <b>3. Accuracy and Limitations of Liability</b>
                  <br />
                  AuditorIQ strives for high accuracy in matching chart content to Medicare policy criteria. However:
                  <br />
                  We do not guarantee the accuracy, completeness, or sufficiency of audit results.
                  <br />
                  Denial Risk Tiers, Compliance Flags, and Policy Recommendations are informational tools only and do not constitute a guarantee of reimbursement or regulatory compliance.
                  <br />
                  You are solely responsible for ensuring your documentation and billing practices meet payer guidelines.
                  <br />
                  AuditorIQ and its officers, employees, contractors, and affiliates are not liable for claim denials, audit penalties, lost reimbursements, or regulatory enforcement actions resulting from your reliance on platform outputs.
                  <br />
                  <br />
                  <b>4. Provider Licensing and Use</b>
                  <br />
                  Each subscription license permits use by one rendering provider associated with their National Provider Identifier (NPI). Audit services are available only for charts created by a licensed provider on your account.
                  <br />
                  Charts submitted under unlicensed NPIs will not be processed. No refunds will be issued for audits blocked due to unregistered providers.
                  <br />
                  <br />
                  <b>5. Acceptable Use Policy</b>
                  <br />
                  You agree not to:
                  <br />
                  Violate any applicable laws or regulations;
                  <br />
                  Submit PHI without appropriate authorization;
                  <br />
                  Attempt unauthorized access to the system;
                  <br />
                  Interfere with platform operations or security;
                  <br />
                  Use the system to compete with, benchmark, or reverse-engineer the Service.
                  <br />
                  AuditorIQ reserves the right to suspend or terminate access for violations of this policy.
                  <br />
                  <br />
                  <b>6. Data Handling and HIPAA Compliance</b>
                  <br />
                  AuditorIQ is designed to meet the requirements of the HIPAA Security Rule.
                  <br />
                  Chart uploads: Processed in-memory for auditing only; files are automatically deleted after audit completion.
                  <br />
                  Audit outputs: May contain PHI and are stored securely on encrypted, HIPAA-compliant infrastructure.
                  <br />
                  De-identification: You are not required to redact PHI prior to upload; however, you must ensure lawful authorization to submit protected health information.
                  <br />
                  <br />
                  <b>7. HIPAA and Business Associate Agreement</b>
                  <br />
                  By accepting these Terms, you acknowledge that AuditorIQ acts as a Business Associate (BA) under HIPAA. This agreement constitutes a fully executed Business Associate Agreement (BAA) in accordance with 45 CFR §164.504(e).
                  <br />
                  AuditorIQ agrees to:
                  <br />
                  Use PHI solely to perform the contracted services;
                  <br />
                  Implement safeguards to protect PHI from unauthorized use or disclosure;
                  <br />
                  Report known breaches of PHI as required by HIPAA;
                  <br />
                  Comply with the applicable provisions of the HIPAA Security Rule.
                  <br />
                  If you require a signed standalone BAA, please contact Compliance@AuditorIQ.ai.
                  <br />
                  <br />
                  <b>8. Use of De-Identified Data</b>
                  <br />
                  AuditorIQ may use and disclose aggregated, de-identified data derived from your uploaded charts and audit results for benchmarking, analytics, model improvement, research, or commercial purposes, including sharing with CMS, Medicare Administrative Contractors, private payers, and healthcare partners.
                  <br />
                  All such data will be stripped of direct identifiers and comply with the de-identification standards defined in 45 CFR §164.514(b). No data will be shared in a way that could reasonably identify any patient, provider, or organization.
                  <br />
                  <br />
                  <b>9. Regulatory Updates</b>
                  <br />
                  AuditorIQ updates its policy engine to reflect changes to Medicare coverage criteria, including new LCDs, NCDs, and CMS Articles issued by MACs. While we aim to stay current, we do not guarantee real-time synchronization. Users are encouraged to confirm coverage rules with official sources when in doubt.
                  <br />
                  <br />
                  <b>10. Feedback and Suggestions</b>
                  <br />
                  If you provide feedback or suggestions to AuditorIQ, you grant us a non-exclusive, royalty-free, perpetual, and irrevocable license to use, adapt, and incorporate such feedback into our platform without restriction or obligation.
                  <br />
                  <br />
                  <b>11. Third-Party Content and Services</b>
                  <br />
                  AuditorIQ may contain links or references to third-party services. We are not responsible for the content, accuracy, availability, or security of these services. Your use of third-party tools is at your own risk.
                  <br />
                  <br />
                  <b>12. Risk Acceptance and AI Limitations</b>
                  <br />
                  You acknowledge that AuditorIQ uses artificial intelligence technologies that may:
                  <br />
                  Provide outputs that are incomplete or imprecise;
                  <br />
                  Misinterpret clinical documentation;
                  <br />
                  Miss policy changes if not yet updated in our database.
                  <br />
                  You agree to use the Service at your own risk and remain solely responsible for ensuring documentation and billing compliance.
                  <br />
                  <br />
                  <b>13. Scope Expansion</b>
                  <br />
                  While AuditorIQ currently focuses on Medicare audits for wound care documentation, we reserve the right to expand our services to additional payers (including commercial plans), medical specialties, and regulatory bodies. This includes, but is not limited to, dermatology, podiatry, vascular, and other clinical domains. We are not limited to any single payer or specialty.
                  <br />
                  <br />
                  <b>14. No Refund Policy and Termination</b>
                  <br />
                  All subscription fees are final and non-refundable.
                  <br />
                  Termination of service is permitted at any time by the user.
                  <br />
                  Your account will remain active through the current billing cycle; no pro-rata credit will be issued.
                  <br />
                  <br />
                  <b>15. Modifications to Terms</b>
                  <br />
                  We may modify these Terms from time to time. Updates will be posted to the registration or account dashboard. Continued use of the Service constitutes acceptance of the revised Terms.
                  <br />
                  <br />
                  <b>16. Compliance with Laws</b>
                  <br />
                  You agree to use AuditorIQ in full compliance with applicable local, state, federal, and international laws, including healthcare privacy and billing regulations.
                  <br />
                  <br />
                  <b>17. Intellectual Property</b>
                  <br />
                  All software, audit logic, templates, output structures, and branding related to AuditorIQ are owned by AuditorIQ, Inc. You may not copy, adapt, or reverse-engineer any part of the platform without our express written consent.
                  <br />
                  <br />
                  <b>18. Indemnification</b>
                  <br />
                  You agree to indemnify, defend, and hold harmless AuditorIQ, Inc., its officers, employees, contractors, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with:
                  <br />
                  Your use or misuse of the Service or audit results;
                  <br />
                  Any violation of these Terms or applicable laws or regulations;
                  <br />
                  The unauthorized use, disclosure, or transmission of PHI or sensitive data by you or under your account;
                  <br />
                  Your reliance on audit outputs or risk scoring for clinical, billing, or compliance decisions;
                  <br />
                  Any allegation that your use of the Service resulted in a billing error, overpayment, denial, audit, investigation, or enforcement action by a governmental or private payer.
                  <br />
                  <br />
                  <b>19. Governing Law and Dispute Resolution</b>
                  <br />
                  These Terms shall be governed by the laws of the State of Delaware. All disputes shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its commercial rules. The arbitration shall take place in Delaware, unless otherwise agreed.
                  <br />
                  <br />
              </p>
              <Button onClick={() => setShowModal(false)} className="btn btn-primary" style={{ padding: "20px", backgroundColor: "black", color: "white" }}>
                  Accept
              </Button>
              </div>
          </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2">info@auditoriq.ai<br/>+(1) 123 456 7890</p>
          </div>
        </div>
        <div style={{ paddingLeft: "50px", paddingBottom: "25px"}}>
          Copyright @ 2025 All rights reserved.
        </div>
      </footer>
    </div>
  );
}
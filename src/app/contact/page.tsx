'use client';

import React, {useEffect, useState} from "react";
import Image from 'next/image';
import ContactForm from '../../components/ContactForm';
import FaqAccordion from '../FaqAccordion';
import { Mail, MapPin, Phone } from "lucide-react";
import '@/app/RegisterButton.css';
import '@/app/ContactButton.css';
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

export default function page() {

  const [showRegisterButton, setShowRegisterButton] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      const storedUsername = sessionStorage.getItem("user_name");
      setUsername(storedUsername);
      const token = sessionStorage.getItem("token");
      setShowRegisterButton(!token);
    });
  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <button onClick={() => window.location.href="/"}><img src="logo_asset.svg" style={{width: "200px" }} /></button>
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
      <div className="justify-center pt-20 pb-20 space-x-4 m-6">
        <h1 className="text-3xl font-bold text-center mb-2">Connect with  <button style={{marginLeft: "15px"}}><img src="logo_asset.svg" style={{width: "200px" }} /></button></h1>
        <p className="text-center">What are you waiting for; Click that submit button!</p>
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-white shadow rounded-2xl space-x-4" style={{paddingLeft: "20%", paddingRight: "20%"}}>
      <div className="flex items-center gap-4">
        <MapPin className="text-blue-600" />
        <div>
          <p className="text-lg font-medium">695 Jerry Street, xxx 221</p>
          <p className="text-lg">xxx, xxx xxxxxx</p>
          <p className="text-lg text-gray-500">United States</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Phone className="text-blue-600" />
        <p className="text-lg font-medium">1 xxx xxx xxx</p>
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
      Find quick answers to the most commonly asked questions about our platform
    </p>
          <FaqAccordion />
      </div>
      <footer className="bg-[#0A2463] text-white" style={{paddingLeft: "10%", paddingRight: "10%"}}>
        <div className="text-white px-8 py-12 flex flex-col md:flex-row items-center justify-between" style={{borderBottom: "1px solid white"}}>
          {/* Left Section - Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-0">
            Let’s Connect with us
          </h2>

          {/* Right Section - Buttons */}
          <div className="flex gap-4">
            {/* Get Started Button */}
            <button className="flex items-center gap-2 bg-blue-100 text-[#0A2463] font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition" style={{cursor: "pointer"}} onClick={() => window.location.href = '/sign-up'}>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-10 text-whilte">
          {/* Branding - spans 2 columns */}
          <div className="md:col-span-2">
            <img src="logo_footer.svg" alt="Logo" className="mb-5" style={{maxWidth: "200px"}} />
            <p className="text-xs">
              AI-Powered Medicare Compliance Audits, In Minutes
            </p>
          </div>
          {/* Important Links */}
          <div className="text-lg">
            <h4 className="font-semibold">Important</h4>
            <ul className="space-y-1 mt-2">
              <li>
                <a href="/#home" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div className="text-lg">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-1 mt-2">
              <li>
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="text-lg">
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2 flex items-center gap-2">
              <img alt="Email" className="w-4 h-4" src="email.svg" />
              info@auditoriq.ai
            </p>
            <p className="mt-2 flex items-center gap-2">
              <img alt="Phone" className="w-4 h-4" src="phone.svg" />
              (1) 123 456 7890
            </p>
          </div>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px"
        }}>
          <span style={{ fontSize: "14px" }}>
            Copyright ©2025, All rights reserved
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <img src="links/facebook.svg" alt="Facebook" />
            <img src="links/linkedin.svg" alt="LinkedIn" />
            <img src="links/icon1.svg" alt="Icon1" />
            <img src="links/twitter.svg" alt="Twitter" />
          </div>
        </div>
      </footer>
    </>
  );
}

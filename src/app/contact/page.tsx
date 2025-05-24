'use client';

import Image from 'next/image';
import ContactForm from './ContactForm';
import FaqAccordion from '../FaqAccordion';
import { Mail, MapPin, Phone } from "lucide-react";

export default function page() {
  return (
    <>
      <div className="justify-center space-x-4 m-6">
        <h1 className="text-3xl font-bold text-center mb-2">Connect with  <button style={{marginLeft: "15px"}} onClick={() => window.location.href="/"}><img src="logo_asset.svg" style={{width: "200px" }} /></button></h1>
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-white shadow rounded-2xl space-x-4" style={{paddingLeft: "10%", paddingRight: "10%"}}>
      <div className="flex items-center gap-4">
        <MapPin className="text-blue-600" />
        <div>
          <p className="text-sm font-medium">695 Jerry Street, xxx 221</p>
          <p className="text-sm">xxx, xxx xxxxxx</p>
          <p className="text-sm text-gray-500">United States</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Phone className="text-blue-600" />
        <p className="text-sm font-medium">1 xxx xxx xxx</p>
      </div>
      <div className="flex items-center gap-4">
        <Mail className="text-blue-600" />
        <p className="text-sm font-medium">info@auditoriq.ai</p>
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
    </>
  );
}

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
import { Pacifico } from "next/font/google";

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

const linkStyle: React.CSSProperties = {
  color: "blue",
  textDecoration: "underline",
  cursor: "pointer",
};

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
  const [showModal, setShowModal] = useState(false);

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
            Sign up with Google
          </Button>
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
            
            <Link href="#" className="text-[#0a2463] hover:underline" style={linkStyle}
          onClick={() => setShowModal(true)}>
              Terms & Conditions
            </Link>
          </label>
        </div>

        {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2>Terms of Policy</h2>
            <p style={{ textAlign: "left"}}>
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

        {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

        <Button
          type="submit"
          className="w-full bg-[#0a2463] min-w-xs max-w-sm mx-auto"
        >
          Next
        </Button>

        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#0a2463] hover:underline">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}

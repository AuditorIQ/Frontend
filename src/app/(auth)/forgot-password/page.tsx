"use client";

import { Button } from "@/components/ui/button";
import { errorToast } from "@/lib/toast";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // call forgot-password endpoint
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (res.ok) {
      setIsSent(true);
    } else if (res.status === 400) {
      errorToast("Email not found!");
      setTimeout(() => {}, 1000);
    } else if (res.status === 401) {
      errorToast("You can't change your account password.");
      setTimeout(() => {}, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[url('/Billboards.jpg')] min-h-screen flex items-center justify-center p-4">
      <div className="h-full max-w-6xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Can't send */}
        {!isSent && (
          <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h1 className="text-2xl mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email"
                className="border p-2 w-full mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className={`w-full bg-navy-800 hover:bg-navy-900 cursor-pointer button ${loading ? "loading" : ""}`}
                style={{ backgroundColor: "#0a2463", cursor: "pointer" }}
                disabled={loading}
              >
                Check your email to reset password
              </Button>
            </form>
          </div>
        )}
        {/* Already sent */}
        {isSent && (
          <>
            <div className="text-center space-y-4">
              <div style={{ fontSize: "42px", color: "black" }}>
                Email has been successfully sent
              </div>
              <div style={{ fontSize: "30px", color: "black" }}>
                You are retrieving your password. The reset link has been sent
                to your email <b>{email}</b>, please go and check it.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

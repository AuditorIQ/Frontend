'use client';

import { successToast } from "@/lib/toast";
import axios from "axios";
import { useEffect } from 'react';

export default function SuccessPage() {
  successToast("Thank you for purchasing!");
  useEffect(() => {
    if (sessionStorage.getItem("user_email") === null || sessionStorage.getItem("user_email") === "")
    {
    const raw = sessionStorage.getItem("formData");
    if (!raw) return; // Avoid parsing null
  
    try {
      const data = JSON.parse(raw);

      const providersArray = Array.isArray(data.providers)
        ? data.providers
        : data.providers?.create || [];
      
      const formatted = {
        ...data,
        providers: {
          create: providersArray.map((provider: any) => ({
            ...provider,
            id: parseInt(provider.id, 10)
          })),
        },
      };
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, JSON.parse(JSON.stringify(formatted)));
      window.location.href="/sign-in";
    } catch (e) {
      console.error("Failed to parse sessionStorage formData:", e);
    }
  }
  else
  {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/subscribe-plan`, {email: sessionStorage.getItem("user_email"),subscriptionType: sessionStorage.getItem("subscriptionType")?.toUpperCase(), isYearly: sessionStorage.getItem("isYearly") === "true"});
    window.location.href="/plan";
  }
  }, []);
  
  return <p>Redirecting...</p>;
}
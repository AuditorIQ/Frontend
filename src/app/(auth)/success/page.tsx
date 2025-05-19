'use client';

import axios from "axios";
import { useEffect } from 'react';

export default function SuccessPage() {

  useEffect(() => {
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
            id: parseInt(provider.id, 10),
            isYearly: true
          })),
        },
      };
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, JSON.parse(JSON.stringify(formatted)));
      window.location.href="/sign-in";
    } catch (e) {
      console.error("Failed to parse sessionStorage formData:", e);
    }
  }, []);
  
  return <p>Redirecting...</p>;
}
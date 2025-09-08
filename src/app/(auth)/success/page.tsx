"use client";

import { successToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import { useEffect } from "react";

export default function Page() {
  // Zustand hooks at the top level
  const userEmail = useAuthStore((s) => s.user?.email?.trim() ?? null);
  const userIsYearly = useAuthStore((s) => s.user?.isYearly ?? false);
  const userSubscriptionType = useAuthStore((s) =>
    s.user?.subscriptionType?.toUpperCase()
  );
  const formData = useAuthStore((s) => s.formData);

  successToast("Thank you for purchasing!");
  setTimeout(() => {}, 1000);

  useEffect(() => {
    if (userEmail === null || userEmail === "") {
      if (!formData) return; // Avoid parsing null

      try {
        const providersArray = Array.isArray(formData.providers)
          ? formData.providers
          : formData.providers?.create || [];

        const formatted = {
          ...formData,
          providers: {
            create: providersArray.map((provider: any) => ({
              ...provider,
              id: parseInt(provider.id, 10),
            })),
          },
        };
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
          JSON.parse(JSON.stringify(formatted))
        );

        successToast("Successfully signed Up");
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
      } catch (e) {
        console.error("Failed to parse sessionStorage formData:", e);
      }
    } else {
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/subscribe-plan`,
        {
          email: userEmail,
          subscriptionType: userSubscriptionType,
          isYearly: userIsYearly,
        }
      );
      window.location.href = "/plan";
    }
  }, [userEmail, userIsYearly, userSubscriptionType, formData]);

  return <p>Redirecting...</p>;
}

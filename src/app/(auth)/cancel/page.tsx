"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { errorToast } from "@/lib/toast";

export default function Page() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);

  // ---- Persisted fallback (handles pre-hydration) ----
  const persisted = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("auth"); // zustand persist key
      if (!raw) return null;
      const state = JSON.parse(raw)?.state ?? null;
      return state;
    } catch {
      return null;
    }
  }, []);

  const persistedUser = persisted?.user ?? null;
  // const persistedForm = persisted?.formData ?? null;

  // Prefer live store, fall back to persisted snapshot
  const effectiveUser = useMemo(
    () => user ?? persistedUser ?? null,
    [user, persistedUser]
  );

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // Let the user know the payment was canceled
    try {
      errorToast("Payment was canceled.");
    } catch {}

    const isLoggedIn = Boolean(effectiveUser?.email);

    if (isLoggedIn) {
      // Logged-in users go back to /plan to review/change plans
      router.replace("/plan");
      return;
    }

    router.replace("/sign-up");
  }, [effectiveUser, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg font-medium">Payment was canceled.</p>
        <p className="text-sm text-gray-500 mt-2">
          Redirecting you to the appropriate page…
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { successToast, errorToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Success() {
  const router = useRouter();

  // Select separately to avoid infinite render loops
  const formData = useAuthStore((s) => s.formData);
  const setFormData = useAuthStore((s) => s.setFormData);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

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
  const persistedForm = persisted?.formData ?? null;

  // Prefer live store, fall back to persisted snapshot
  const effectiveUser = useMemo(
    () => user ?? persistedUser ?? null,
    [user, persistedUser]
  );
  const draft = useMemo(
    () => formData ?? persistedForm ?? null,
    [formData, persistedForm]
  );

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      const isLoggedIn = Boolean(effectiveUser?.email);

      // ---------- LOGGED-IN: subscribe plan ----------
      if (isLoggedIn) {
        successToast("Subscription updated!");
        setFormData(null); // clean any leftover draft
        router.replace("/plan");

        return;
      }

      // ---------- GUEST: complete signup with providers ----------
      if (!draft) {
        errorToast(
          "We couldn't restore your signup info. Please sign up again."
        );
        router.replace("/sign-up");
        return;
      }

      const providersArray = Array.isArray(draft.providers)
        ? draft.providers
        : [];

      const payload = {
        name: draft.name,
        email: draft.email,
        password: draft.password,
        practiceName: draft.practiceName,
        zipCode: draft.zipCode,
        subscriptionType: draft.subscriptionType?.toUpperCase() ?? "STARTER",
        isYearly: Boolean(draft.isYearly),
        subscribedAt: draft.subscribedAt ?? null,
        providers: {
          create: providersArray.map((p: any) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            credentials: p.credentials, // "MD" | "DO" | "DPM"
            npiNumber: String(p.npiNumber),
            zipCode: p.zipCode,
            specialty: p.specialty,
          })),
        },
      };

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
          payload
        );
        successToast("Signup completed!");
      } catch (e: any) {
        if (e?.response?.status === 409) {
          successToast("Account already exists. Please sign in.");
        } else {
          console.error("Signup failed:", e?.response?.data || e);
          errorToast("Signup failed. Please sign in or try again.");
        }
      } finally {
        try {
          setFormData(null);
        } catch {}
        router.replace("/sign-in");
      }
    };

    run();
  }, [draft, effectiveUser, router, setFormData, updateUser]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg font-medium">Finalizing The Purchase Process</p>
        <p className="text-sm text-gray-500 mt-2">
          Please hold on for a moment.
        </p>
      </div>
    </div>
  );
}

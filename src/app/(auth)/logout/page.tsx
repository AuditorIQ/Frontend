"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // clear session
  useAuthStore.getState().clearAuth();

    window.location.href = "/";
  });
  return <></>;
}

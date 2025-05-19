'use client';

import { useSearchParams } from "next/navigation";
import { RegistrationFlow } from "./registration-flow";

export default function ClientWrapper() {
  const searchParams = useSearchParams();
  const stepParam = Number(searchParams.get("step") || "1");
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  return <RegistrationFlow curstep={stepParam} curname={name} curemail={email} />;
}
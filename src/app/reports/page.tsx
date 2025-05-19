import React from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";

export default function reports() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 grid gap-4">This page will be comming soon.</Card>
    </div>
  );
}
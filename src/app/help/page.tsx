"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Card } from "@/components/ui/card";
import SubMenu from "@/components/SubMenu/SubMenu";

export default function help() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <div className="flex-grow">This page will be coming soon.</div>
      </Card>
    </div>
  );
}

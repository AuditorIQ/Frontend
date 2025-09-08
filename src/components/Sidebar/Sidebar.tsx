"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  ClipboardList,
  PieChart,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Edit,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { buildAccessContext, shouldShowNavItem } from "@/lib/access";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const navItems = [
    {
      section: "Main",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Results", href: "/results", icon: ClipboardList },
        { name: "Reports", href: "/reports", icon: PieChart },
      ],
    },
    {
      section: "Others",
      items: [
        { name: "Prompt", href: "/prompt", icon: Edit },
        { name: "Plan & Payments", href: "/plan", icon: CreditCard },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Help", href: "/help", icon: HelpCircle },
        { name: "Log Out", href: "/logout", icon: LogOut },
      ],
    },
  ];

  const accessCtx = buildAccessContext({
    isAuthenticated,
    isAdmin: user?.isAdmin ?? false,
    subscriptionType: user?.subscriptionType ?? null,
    subscribedAt: user?.subscribedAt ?? null,
    isYearly: user?.isYearly,
  });

  return (
    <aside className="w-64 h-full bg-white border-r p-4 text-sm">
      {navItems.map((section, index) => (
        <div key={index} className="mb-6">
          <h4 className="uppercase text-xs text-gray-400 mb-2">
            {section.section}
          </h4>
          <nav className="space-y-1">
            {section.items
              .filter((item) => shouldShowNavItem(item.name, accessCtx))
              .map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href;

                const className = clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-blue-900 text-white"
                    : "text-gray-700 hover:bg-blue-800 hover:text-white"
                );

                return (
                  <Link key={name} href={href} className={className}>
                    <Icon size={18} />
                    {name}
                  </Link>
                );
              })}
          </nav>
        </div>
      ))}
    </aside>
  );
}

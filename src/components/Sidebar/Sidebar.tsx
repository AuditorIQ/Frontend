"use client";

import {
  LayoutDashboard,
  ClipboardList,
  PieChart,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

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
      { name: "Plan & Payments", href: "/plan", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Help", href: "/help", icon: HelpCircle },
      { name: "Log Out", href: "/logout", icon: LogOut },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 h-full bg-white border-r p-4 text-sm">
      <button
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer" }}
      >
        <img
          style={{ width: "200px", marginBottom: "15px" }}
          src="logo_asset.svg"
        />
      </button>
      {navItems.map((section, index) => (
        <div key={index} className="mb-6">
          <h4 className="uppercase text-xs text-gray-400 mb-2">
            {section.section}
          </h4>
          <nav className="space-y-1">
            {section.items.map(({ name, href, icon: Icon }) => {
              const isActive = usePathname() === href;
              const userEmail =
                typeof window !== "undefined"
                  ? sessionStorage.getItem("user_email")
                  : null;
              const isDisabled =
                name === "Plan & Payments" && userEmail === "test_user";

              const baseClasses =
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors";
              const activeClass = isActive
                ? "bg-blue-900 text-white"
                : "text-gray-700";
              const disabledClass = isDisabled
                ? "text-gray-400 cursor-not-allowed pointer-events-none"
                : "hover:bg-gray-100";

              const className = clsx(baseClasses, activeClass, disabledClass);

              return isDisabled ? (
                <></>
              ) : (
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

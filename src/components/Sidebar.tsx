'use client';

import { LayoutDashboard, ClipboardList, PieChart, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react";
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
      { name: "Log Out", href: "/sign-in", icon: LogOut },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 h-full bg-white border-r p-4 text-sm">
    <center><img style={{ width: "200px", paddingBottom: "50px"}} src= "logo_asset.svg" /></center>
      {navItems.map((section, index) => (
        <div key={index} className="mb-6">
          <h4 className="uppercase text-xs text-gray-400 mb-2">{section.section}</h4>
          <nav className="space-y-1">
            {section.items.map(({ name, href, icon: Icon }) => {
              const isActive = usePathname() === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                    isActive ? "bg-blue-900 text-white" : "text-gray-700"
                  )}
                >
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
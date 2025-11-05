"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  HeartPulse,
  LayoutDashboard,
  Leaf,
  LineChart,
  Mic,
  Store,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CowIcon } from "@/components/icons";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ask", label: "Ask KrishiGPT", icon: Mic },
  { href: "/diagnose", label: "Diagnose Plant", icon: Leaf },
  { href: "/animal-diagnose", label: "Diagnose Animal", icon: HeartPulse },
  { href: "/cattle-help", label: "Cattle Help", icon: CowIcon },
  { href: "/mandi-prices", label: "Mandi Prices", icon: LineChart },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/alerts", label: "Alerts & Forecast", icon: Bell },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

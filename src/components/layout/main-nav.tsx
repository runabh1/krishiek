"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  FileText,
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
  { href: "/cattle-help", label: "Cattle Help", icon: CowIcon },
  { href: "/mandi-prices", label: "Mandi Prices", icon: LineChart },
  { href: "/forms", label: "Voice Form Filler", icon: FileText },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/alerts", label: "Weather Alerts", icon: Bell },
  { href: "/reports", label: "Generate Reports", icon: BarChart3 },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

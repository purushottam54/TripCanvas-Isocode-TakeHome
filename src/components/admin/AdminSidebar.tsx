"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Inbox,
  History,
  CornerDownRight,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { UserProfile } from "@/types/auth";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  user: UserProfile | null;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    {
      name: "Package CMS",
      href: "/admin/packages",
      icon: Compass,
      visible: true,
    },
    {
      name: "Enquiry Inbox",
      href: "/admin/enquiries",
      icon: Inbox,
      visible: true,
    },
    {
      name: "Audit & Version Logs",
      href: "/admin/activity",
      icon: History,
      visible: true,
    },
    {
      name: "Legacy Redirects",
      href: "/admin/redirects",
      icon: CornerDownRight,
      visible: user?.role === "admin" || user?.role === "editor",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#D9E2D8] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Bar */}
        <div className="h-16 px-6 border-b border-[#D9E2D8] flex items-center justify-between">
          <Link href="/admin/packages" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-[#173F35] flex items-center justify-center text-white font-serif font-bold text-sm">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-[#173F35] leading-tight">
                TripCanvas
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#252A27]/60">
                Staff Operations
              </span>
            </div>
          </Link>
        </div>

        {/* User Identity Chip */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-[#F7F5EF] border border-[#D9E2D8]/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173F35] truncate">
              {user?.fullName || "Staff Member"}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                user?.role === "admin"
                  ? "bg-emerald-100 text-emerald-800"
                  : user?.role === "editor"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user?.role || "staff"}
            </span>
          </div>
          <div className="text-[11px] text-[#252A27]/60 truncate">
            {user?.email || "staff@tripcanvas.internal"}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/packages" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#173F35] text-[#F7F5EF]"
                      : "text-[#252A27]/80 hover:bg-[#F7F5EF] hover:text-[#173F35]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#D9E2D8] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#252A27]/70 hover:bg-[#F7F5EF] hover:text-[#173F35] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Public Website
          </span>
          <span className="text-[10px] bg-[#D9E2D8] px-1.5 py-0.5 rounded">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

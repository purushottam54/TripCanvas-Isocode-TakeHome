"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserCheck, ArrowRight, Lock, Sparkles, AlertCircle } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState("admin@tripcanvas.internal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (emailToLogin: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToLogin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Redirect based on role
      if (emailToLogin.includes("consultant")) {
        router.push("/admin/enquiries");
      } else {
        router.push("/admin/packages");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F7F5EF] p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-[#173F35] flex items-center justify-center text-[#F7F5EF] font-serif text-xl font-bold">
              T
            </div>
            <span className="font-serif text-2xl font-bold text-[#173F35]">
              TripCanvas
            </span>
          </Link>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C58B63]">
            Internal Staff Operations Desk
          </div>
          <p className="text-xs text-[#252A27]/70">
            Sign in to access the Package CMS, AI-Assisted Enquiry Inbox, and Audit Logs.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Role Switcher Tabs */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider">
            Select Demo Account Role:
          </label>

          {/* Admin Option */}
          <div
            onClick={() => setSelectedEmail("admin@tripcanvas.internal")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              selectedEmail === "admin@tripcanvas.internal"
                ? "border-[#173F35] bg-[#173F35]/5 shadow-sm ring-1 ring-[#173F35]"
                : "border-[#D9E2D8] hover:bg-[#F7F5EF]/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#C58B63]" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173F35]">Kavitha Nair (Admin)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Full Access
                </span>
              </div>
              <p className="text-[#252A27]/70 text-[11px] mt-0.5">
                Manage all packages, publish versions, view all enquiries, and inspect audit activity logs.
              </p>
            </div>
          </div>

          {/* Editor Option */}
          <div
            onClick={() => setSelectedEmail("editor@tripcanvas.internal")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              selectedEmail === "editor@tripcanvas.internal"
                ? "border-[#173F35] bg-[#173F35]/5 shadow-sm ring-1 ring-[#173F35]"
                : "border-[#D9E2D8] hover:bg-[#F7F5EF]/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#C58B63] text-white flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173F35]">Arjun Menon (Content Editor)</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px]">
                  CMS Editor
                </span>
              </div>
              <p className="text-[#252A27]/70 text-[11px] mt-0.5">
                Draft and edit packages, manage itineraries, seasonal rates, and preview changes.
              </p>
            </div>
          </div>

          {/* Consultant Option */}
          <div
            onClick={() => setSelectedEmail("consultant@tripcanvas.internal")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              selectedEmail === "consultant@tripcanvas.internal"
                ? "border-[#173F35] bg-[#173F35]/5 shadow-sm ring-1 ring-[#173F35]"
                : "border-[#D9E2D8] hover:bg-[#F7F5EF]/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#252A27] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#C58B63]" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173F35]">Deepa Kurian (Senior Tour Consultant)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                  CRM & Quotes
                </span>
              </div>
              <p className="text-[#252A27]/70 text-[11px] mt-0.5">
                Process enquiries, correct AI extractions, review package suggestions, and approve reply drafts.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleLogin(selectedEmail)}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-[#173F35] text-[#F7F5EF] font-semibold text-xs sm:text-sm hover:bg-[#14352d] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
        >
          <Lock className="w-4 h-4 text-[#C58B63]" />
          <span>{loading ? "Authenticating Session..." : `Sign In as ${selectedEmail.split("@")[0].toUpperCase()}`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-[#252A27]/60 hover:text-[#173F35] underline">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}


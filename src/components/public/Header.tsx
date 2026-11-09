"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Compass, ShieldCheck } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#D9E2D8]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#173F35] flex items-center justify-center text-[#F7F5EF] font-serif text-lg font-bold shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl tracking-tight text-[#173F35] font-semibold group-hover:text-[#C58B63] transition-colors">
              TripCanvas
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#252A27]/60 -mt-1">
              Kerala & South India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#252A27]/80">
          <Link
            href="/packages"
            className="hover:text-[#173F35] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-[#C58B63]" />
            Holiday Packages
          </Link>
          <Link href="/#destinations" className="hover:text-[#173F35] transition-colors">
            Destinations
          </Link>
          <Link href="/#experiences" className="hover:text-[#173F35] transition-colors">
            Experiences
          </Link>
          <Link href="/about" className="hover:text-[#173F35] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#173F35] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Header CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-wider text-[#173F35] hover:text-[#C58B63] transition-colors flex items-center gap-1 px-3 py-1.5 rounded border border-[#D9E2D8]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Staff Portal
          </Link>
          <Link
            href="/enquire"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#173F35] text-[#F7F5EF] font-medium text-sm shadow-sm hover:bg-[#14352d] hover:shadow transition-all"
          >
            Enquire Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            href="/enquire"
            className="px-3.5 py-1.5 rounded-full bg-[#173F35] text-[#F7F5EF] text-xs font-medium"
          >
            Enquire
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#173F35] hover:bg-[#ede8db]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D9E2D8] bg-[#F7F5EF] px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-base text-[#252A27]">
            <Link
              href="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173F35]"
            >
              Holiday Packages
            </Link>
            <Link
              href="/#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173F35]"
            >
              Destinations
            </Link>
            <Link
              href="/#experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173F35]"
            >
              Experiences
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173F35]"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#173F35]"
            >
              Contact
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#173F35] font-semibold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Staff Login (Admin / Editor / Consultant)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


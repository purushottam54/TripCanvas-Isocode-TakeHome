"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/packages");
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#173F35]">
      {/* Background Cinematic Image with Subtle Editorial Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85"
          alt="Alleppey Backwaters Kerala Houseboat at Dusk"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Editorial gradient overlay for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#173F35]/90 via-[#173F35]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173F35] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F5EF]/15 backdrop-blur-md border border-[#F7F5EF]/20 text-xs font-medium text-[#F7F5EF]">
            <Sparkles className="w-3.5 h-3.5 text-[#C58B63]" />
            Curated Kerala & South India Escapes
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F7F5EF] leading-[1.08]">
            Find Your Way to <span className="italic font-normal text-[#C58B63]">Kerala.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#D9E2D8] font-light leading-relaxed max-w-xl">
            Glide past quiet palm-lined backwaters in a traditional Kettuvallam, wake to mist-carpeted tea
            hills in Munnar, and experience authentic South Indian hospitality with transparent pricing.
          </p>

          {/* Quick Search & Explore CTA */}
          <div className="pt-2">
            <form
              onSubmit={handleSearch}
              className="bg-[#F7F5EF] p-2 rounded-2xl shadow-xl max-w-lg flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-3 gap-2.5">
                <Search className="w-5 h-5 text-[#C58B63] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Destination or experience (e.g. Munnar, Houseboat)"
                  className="w-full bg-transparent text-sm text-[#252A27] placeholder:text-[#252A27]/50 focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#173F35] text-[#F7F5EF] text-sm font-medium hover:bg-[#14352d] transition-all shrink-0 gap-2 shadow-sm"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#D9E2D8]/80 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C58B63]" />
              Published Database Rates
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C58B63]" />
              Twin Sharing Basis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C58B63]" />
              Transparent 5% GST
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

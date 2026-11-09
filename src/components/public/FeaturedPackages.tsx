import Link from "next/link";
import { PackageRecord } from "@/types/package";
import { PackageCard } from "./PackageCard";
import { ArrowRight } from "lucide-react";

interface FeaturedPackagesProps {
  packages: PackageRecord[];
}

export function FeaturedPackages({ packages }: FeaturedPackagesProps) {
  return (
    <section className="py-24 bg-[#ede8db]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63] block mb-2">
              Curated Itineraries
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
              Featured Holiday Packages
            </h2>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#173F35] hover:text-[#C58B63] transition-colors group"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#D9E2D8]">
            <p className="text-sm text-[#252A27]/60">No packages currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


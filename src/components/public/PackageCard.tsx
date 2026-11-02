import Link from "next/link";
import { PackageRecord } from "@/types/package";
import { Clock, MapPin, ArrowRight, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PackageCardProps {
  pkg: PackageRecord;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const version = pkg.publishedVersion || pkg.draftVersion;
  if (!version) return null;

  const heroPhoto =
    version.photos?.find((p) => p.isHero)?.url ||
    version.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80";

  const startingPrice = version.prices?.[0]?.pricePerPerson;
  const currency = version.prices?.[0]?.currency || "INR";
  const seasonName = version.prices?.[0]?.seasonName || "Seasonal Rate";

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#D9E2D8] shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Photograph Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#173F35]/5">
        <img
          src={heroPhoto}
          alt={version.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#173F35]/90 backdrop-blur-md text-xs font-medium text-[#F7F5EF] shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#C58B63]" />
            {version.durationDays} Days / {Math.max(1, version.durationDays - 1)} Nights
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#173F35] shadow-sm">
            <Star className="w-3 h-3 text-[#C58B63] fill-[#C58B63]" />
            {version.hotelCategory}
          </span>
        </div>

        {/* Destination Chip */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs text-white">
            <MapPin className="w-3 h-3 text-[#C58B63]" />
            {version.destination}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#173F35] group-hover:text-[#C58B63] transition-colors line-clamp-2">
            {version.title}
          </h3>
          <p className="text-xs text-[#252A27]/70 mt-2 line-clamp-3 leading-relaxed">
            {version.overview}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-[#D9E2D8]/60 flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#252A27]/60 block font-medium">
              From ({seasonName.split("(")[0].trim()})
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-bold text-[#173F35]">
                {formatCurrency(startingPrice, currency)}
              </span>
              <span className="text-[11px] text-[#252A27]/60">/ person</span>
            </div>
            <span className="text-[10px] text-[#C58B63] font-medium block">
              Twin sharing · +5% GST
            </span>
          </div>

          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#173F35] text-[#F7F5EF] text-xs font-medium hover:bg-[#C58B63] transition-colors shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

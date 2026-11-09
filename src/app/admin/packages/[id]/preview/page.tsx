import { notFound } from "next/navigation";
import Link from "next/link";
import { getPackageById } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { SeasonalPricingTable } from "@/components/public/SeasonalPricingTable";
import { ItineraryAccordion } from "@/components/public/ItineraryAccordion";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Star,
  Check,
  X,
  ArrowLeft,
  Eye,
  AlertTriangle,
  Send,
} from "lucide-react";

interface PreviewPackagePageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPackagePage({ params }: PreviewPackagePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="p-12 text-center text-red-700">
        Unauthorized: Staff credentials required to preview unreleased drafts.
      </div>
    );
  }

  const { id } = await params;
  const pkg = await getPackageById(id);

  if (!pkg) {
    notFound();
  }

  // Preview renders draftVersion if exists, else publishedVersion
  const version = pkg.draftVersion || pkg.publishedVersion;
  if (!version) {
    notFound();
  }

  const heroPhoto =
    version.photos?.find((p) => p.isHero)?.url ||
    version.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80";

  const startingPrice = version.prices?.[0]?.pricePerPerson;
  const currency = version.prices?.[0]?.currency || "INR";

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-24">
      {/* Draft Warning Banner */}
      <div className="bg-amber-500 text-black px-4 py-3 border-b border-amber-600 font-semibold text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>
            STAFF PREVIEW MODE · Viewing Draft Version v{version.versionNumber} for {pkg.id}. This is NOT public.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/packages/${pkg.id}/edit`}
            className="px-3 py-1 bg-black text-white rounded-lg text-xs hover:bg-neutral-800"
          >
            Back to Editor
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-[#173F35] overflow-hidden">
        <img
          src={heroPhoto}
          alt={version.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173F35] via-[#173F35]/40 to-black/30" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold text-[10px] uppercase">
              DRAFT PREVIEW
            </span>
            <span className="text-xs text-white/80">
              {version.destination} · {version.durationDays} Days · {version.hotelCategory}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F5EF]">
            {version.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-sm space-y-3">
              <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                Draft Overview
              </h2>
              <p className="text-xs sm:text-sm text-[#252A27]/80 leading-relaxed">
                {version.overview}
              </p>
            </div>

            {/* Itinerary */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                Draft Itinerary ({version.itinerary.length} Days)
              </h2>
              <ItineraryAccordion days={version.itinerary} />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[#173F35] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Inclusions
                </h3>
                <ul className="space-y-2">
                  {version.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#252A27]/80">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[#C58B63] flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" /> Exclusions
                </h3>
                <ul className="space-y-2">
                  {version.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#252A27]/80">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#D9E2D8] shadow-sm space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#173F35]">
                Draft Seasonal Pricing
              </h3>
              <SeasonalPricingTable
                prices={version.prices || []}
                priceBasis={version.priceBasis}
                gstDisclosure={version.gstDisclosure}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


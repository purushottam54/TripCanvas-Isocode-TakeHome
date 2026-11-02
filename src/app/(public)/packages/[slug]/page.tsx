import { notFound } from "next/navigation";
import Link from "next/link";
import { getPackageBySlug, getPublishedPackages } from "@/lib/db/store";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { SeasonalPricingTable } from "@/components/public/SeasonalPricingTable";
import { ItineraryAccordion } from "@/components/public/ItineraryAccordion";
import { PackageCard } from "@/components/public/PackageCard";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Star,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Navigation,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PackageDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  const version = pkg?.publishedVersion;

  if (!version) {
    return { title: "Package Not Found" };
  }

  return {
    title: version.seoTitle || `${version.title} | TripCanvas`,
    description: version.seoDescription || version.overview.slice(0, 160),
    openGraph: {
      title: version.title,
      description: version.overview.slice(0, 160),
      images: version.photos?.[0]?.url ? [version.photos[0].url] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg || !pkg.publishedVersion) {
    notFound();
  }

  const version = pkg.publishedVersion;
  const heroPhoto =
    version.photos?.find((p) => p.isHero)?.url ||
    version.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80";

  const startingPrice = version.prices?.[0]?.pricePerPerson;
  const currency = version.prices?.[0]?.currency || "INR";
  const seasonName = version.prices?.[0]?.seasonName || "Seasonal Rate";

  // Related packages
  const allPublished = await getPublishedPackages();
  const relatedPackages = allPublished
    .filter((p) => p.id !== pkg.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Large Cinematic Hero Section */}
        <section className="relative w-full h-[60vh] sm:h-[70vh] bg-[#173F35] overflow-hidden">
          <img
            src={heroPhoto}
            alt={version.title}
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173F35] via-[#173F35]/40 to-black/30" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 text-white">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-[#F7F5EF]">
                <MapPin className="w-3.5 h-3.5 text-[#C58B63]" />
                {version.destination}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/80 backdrop-blur-md text-xs font-medium text-[#F7F5EF]">
                <Clock className="w-3.5 h-3.5 text-[#C58B63]" />
                {version.durationDays} Days / {Math.max(1, version.durationDays - 1)} Nights
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#173F35]">
                <Star className="w-3.5 h-3.5 text-[#C58B63] fill-[#C58B63]" />
                {version.hotelCategory} Category
              </span>
              <span className="text-xs font-mono bg-black/40 px-2.5 py-1 rounded-md text-[#D9E2D8]">
                {pkg.id}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F5EF] max-w-4xl">
              {version.title}
            </h1>
          </div>
        </section>

        {/* Sticky Sub-Header with Instant Booking Action */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9E2D8] py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#252A27]/60 block">
                Starting Published Rate
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#173F35]">
                  {formatCurrency(startingPrice, currency)}
                </span>
                <span className="text-xs text-[#252A27]/70">/ person ({version.priceBasis})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/enquire/${pkg.slug}`}
                className="px-6 py-2.5 rounded-full bg-[#173F35] text-[#F7F5EF] font-semibold text-xs sm:text-sm shadow-md hover:bg-[#14352d] transition-all flex items-center gap-2"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column (2 Cols): Overview, Itinerary, Inclusions */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <section className="bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-sm space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                  Holiday Overview
                </h2>
                <p className="text-sm sm:text-base text-[#252A27]/80 leading-relaxed">
                  {version.overview}
                </p>
              </section>

              {/* Photos Gallery */}
              {version.photos && version.photos.length > 1 && (
                <section className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#173F35]">
                    Destination Photography
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {version.photos.map((p, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#D9E2D8]"
                      >
                        <img
                          src={p.url}
                          alt={p.caption || version.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        {p.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-[11px] text-white">
                            {p.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Day-Wise Itinerary */}
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                  Day-Wise Itinerary
                </h2>
                <ItineraryAccordion days={version.itinerary} />
              </section>

              {/* Inclusions & Exclusions */}
              <section className="bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                  Inclusions & Exclusions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
                  {/* Inclusions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold uppercase tracking-wider text-[#173F35] flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      What Is Included
                    </h3>
                    <ul className="space-y-2.5">
                      {version.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#252A27]/80">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold uppercase tracking-wider text-[#C58B63] flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500" />
                      What Is Excluded
                    </h3>
                    <ul className="space-y-2.5">
                      {version.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#252A27]/80">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Illustrative Route Map */}
              {version.routeMap && version.routeMap.length > 0 && (
                <section className="bg-white rounded-3xl p-8 border border-[#D9E2D8] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#173F35]">
                    <Navigation className="w-5 h-5 text-[#C58B63]" />
                    <h2 className="font-serif text-2xl font-bold">
                      Curated Tour Route
                    </h2>
                  </div>
                  <p className="text-xs text-[#252A27]/70">
                    Illustrative circuit map with private air-conditioned vehicle transfers throughout:
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {version.routeMap
                      .sort((a, b) => a.order - b.order)
                      .map((wp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-[#F7F5EF] border border-[#D9E2D8] text-xs font-medium text-[#173F35]">
                            {wp.order}. {wp.name}
                          </span>
                          {idx < (version.routeMap?.length || 0) - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-[#C58B63]" />
                          )}
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column (1 Col): Pricing Table & Direct Enquiry Card */}
            <div className="space-y-8">
              {/* Seasonal Pricing Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63]">
                    Transparent Pricing
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#173F35] mt-1">
                    Available Seasonal Rates
                  </h3>
                  <p className="text-xs text-[#252A27]/70 mt-1">
                    Prices retrieved strictly from our database.
                  </p>
                </div>

                <SeasonalPricingTable
                  prices={version.prices || []}
                  priceBasis={version.priceBasis}
                  gstDisclosure={version.gstDisclosure}
                />

                <div className="pt-2">
                  <Link
                    href={`/enquire/${pkg.slug}`}
                    className="w-full py-3.5 px-6 rounded-full bg-[#173F35] text-[#F7F5EF] font-semibold text-xs sm:text-sm hover:bg-[#14352d] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Enquire for this Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Booking Confidence Card */}
              <div className="bg-[#ede8db]/60 rounded-3xl p-6 border border-[#D9E2D8] space-y-3 text-xs text-[#252A27]/80">
                <div className="flex items-center gap-2 font-bold text-[#173F35]">
                  <ShieldCheck className="w-4 h-4 text-[#C58B63]" />
                  Why Book With TripCanvas
                </div>
                <p>• Verified 4-star properties inspected periodically by our staff.</p>
                <p>• Dedicated local tour consultant assigned to your booking.</p>
                <p>• 24x7 on-trip assistance from our Fort Kochi travel desk.</p>
                <p>• No hidden surcharges: GST and driver allowances included clearly.</p>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <div className="pt-20 border-t border-[#D9E2D8] mt-16 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#C58B63] font-semibold">
                    Alternative Journeys
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-[#173F35]">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href="/packages"
                  className="text-xs font-semibold text-[#173F35] hover:text-[#C58B63] flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPackages.map((rel) => (
                  <PackageCard key={rel.id} pkg={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { getPublishedPackages } from "@/lib/db/store";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { PackageCard } from "@/components/public/PackageCard";
import Link from "next/link";
import { Search, SlidersHorizontal, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

interface PackagesPageProps {
  searchParams: Promise<{
    search?: string;
    duration?: string;
    price?: string;
    season?: string;
    sort?: string;
  }>;
}

export default async function PackagesListingPage({ searchParams }: PackagesPageProps) {
  const params = await searchParams;
  const searchTerm = (params.search || "").toLowerCase().trim();
  const durationFilter = params.duration || "all";
  const priceFilter = params.price || "all";
  const seasonFilter = params.season || "all";
  const sortOption = params.sort || "recommended";

  const allPublished = await getPublishedPackages();

  // Apply filters strictly on database published packages
  let filtered = allPublished.filter((pkg) => {
    const v = pkg.publishedVersion;
    if (!v) return false;

    // Search filter
    if (searchTerm) {
      const corpus = `${v.title} ${v.destination} ${v.overview}`.toLowerCase();
      if (!corpus.includes(searchTerm)) return false;
    }

    // Duration filter
    if (durationFilter === "short" && v.durationDays > 4) return false;
    if (durationFilter === "medium" && (v.durationDays < 5 || v.durationDays > 7)) return false;
    if (durationFilter === "long" && v.durationDays < 8) return false;

    // Price filter (based on starting seasonal rate)
    const basePrice = v.prices?.[0]?.pricePerPerson || 0;
    if (priceFilter === "under25k" && basePrice > 25000) return false;
    if (priceFilter === "25kTo35k" && (basePrice < 25000 || basePrice > 35000)) return false;
    if (priceFilter === "above35k" && basePrice < 35000) return false;

    // Season filter
    if (seasonFilter !== "all") {
      const hasSeason = v.prices?.some((p) =>
        p.seasonName.toLowerCase().includes(seasonFilter.toLowerCase())
      );
      if (!hasSeason) return false;
    }

    return true;
  });

  // Sorting
  if (sortOption === "priceAsc") {
    filtered.sort((a, b) => {
      const pa = a.publishedVersion?.prices?.[0]?.pricePerPerson || 0;
      const pb = b.publishedVersion?.prices?.[0]?.pricePerPerson || 0;
      return pa - pb;
    });
  } else if (sortOption === "priceDesc") {
    filtered.sort((a, b) => {
      const pa = a.publishedVersion?.prices?.[0]?.pricePerPerson || 0;
      const pb = b.publishedVersion?.prices?.[0]?.pricePerPerson || 0;
      return pb - pa;
    });
  } else if (sortOption === "durationAsc") {
    filtered.sort(
      (a, b) => (a.publishedVersion?.durationDays || 0) - (b.publishedVersion?.durationDays || 0)
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C58B63]" />
            Curated South India Escapes
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#173F35] tracking-tight">
            Holiday Packages
          </h1>
          <p className="text-sm text-[#252A27]/70 mt-3 leading-relaxed">
            Browse published bespoke holidays with authentic seasonal prices retrieved directly from our
            database. All rates include verified luxury stays and private chauffeur movement.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-[#D9E2D8] shadow-sm mb-12 space-y-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#C58B63] absolute left-3.5 top-3" />
              <input
                type="text"
                name="search"
                defaultValue={params.search || ""}
                placeholder="Search destination..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
              />
            </div>

            {/* Duration */}
            <div>
              <select
                name="duration"
                defaultValue={durationFilter}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35] bg-white text-[#252A27]"
              >
                <option value="all">Any Duration</option>
                <option value="short">Short Getaway (1–4 Days)</option>
                <option value="medium">Classic Escapes (5–7 Days)</option>
                <option value="long">Extended Journey (8+ Days)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <select
                name="price"
                defaultValue={priceFilter}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35] bg-white text-[#252A27]"
              >
                <option value="all">Any Price Range</option>
                <option value="under25k">Under ₹25,000 / person</option>
                <option value="25kTo35k">₹25,000 – ₹35,000 / person</option>
                <option value="above35k">Above ₹35,000 / person</option>
              </select>
            </div>

            {/* Season Filter */}
            <div>
              <select
                name="season"
                defaultValue={seasonFilter}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35] bg-white text-[#252A27]"
              >
                <option value="all">All Seasons</option>
                <option value="peak">Peak Season (Oct–Mar)</option>
                <option value="monsoon">Monsoon Renewal (Jun–Sep)</option>
                <option value="standard">Standard / All Year</option>
              </select>
            </div>

            {/* Sort & Submit */}
            <div className="flex gap-2">
              <select
                name="sort"
                defaultValue={sortOption}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35] bg-white text-[#252A27]"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="durationAsc">Duration: Short to Long</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#173F35] text-[#F7F5EF] text-xs font-semibold rounded-xl hover:bg-[#14352d] transition-colors flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#252A27]/70">
          <span>
            Showing <strong>{filtered.length}</strong> published package
            {filtered.length === 1 ? "" : "s"}
          </span>
          {(searchTerm || durationFilter !== "all" || priceFilter !== "all" || seasonFilter !== "all") && (
            <Link
              href="/packages"
              className="text-[#C58B63] font-semibold hover:underline"
            >
              Reset Filters
            </Link>
          )}
        </div>

        {/* Package Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-[#D9E2D8] text-center space-y-4 max-w-lg mx-auto">
            <Compass className="w-10 h-10 text-[#C58B63] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#173F35]">
              No Matching Packages Found
            </h3>
            <p className="text-xs text-[#252A27]/70">
              Try adjusting your search criteria or explore our signature 6-day Munnar & Alleppey
              journey.
            </p>
            <Link
              href="/packages"
              className="inline-block px-5 py-2.5 rounded-full bg-[#173F35] text-[#F7F5EF] text-xs font-medium"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


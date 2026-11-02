import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface DestinationItem {
  name: string;
  tagline: string;
  image: string;
  filterSlug: string;
  description: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    name: "Munnar",
    tagline: "Rolling Tea Terraces & Mountain Air",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    filterSlug: "munnar",
    description: "Endless emerald valleys carpeted in tea bushes, cool hill-station climate, and Nilgiri Tahr sanctuaries.",
  },
  {
    name: "Alleppey",
    tagline: "Venice of the East & Backwaters",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    filterSlug: "alleppey",
    description: "Drift past tranquil canals and coconut groves aboard handcrafted traditional thatch-roofed houseboats.",
  },
  {
    name: "Thekkady",
    tagline: "Spice Sanctuaries & Lake Safaris",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
    filterSlug: "thekkady",
    description: "Dense rainforests, Periyar tiger reserve boat safaris, and aromatic cardamom plantation walks.",
  },
  {
    name: "Rameswaram",
    tagline: "Sacred Seas & The Pamban Crossing",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    filterSlug: "rameswaram",
    description: "Historic island pilgrimage corridor spanning over the Indian ocean, sacred theerthams, and Dhanushkodi.",
  },
  {
    name: "Kanyakumari",
    tagline: "Confluence of Three Oceans",
    image: "https://images.unsplash.com/photo-1621641147575-d918a514d4e0?auto=format&fit=crop&w=800&q=80",
    filterSlug: "kanyakumari",
    description: "India's southernmost tip where Arabian Sea, Indian Ocean, and Bay of Bengal converge under dramatic sunrises.",
  },
];

export function Destinations() {
  return (
    <section id="destinations" className="py-24 bg-[#F7F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63] block mb-2">
              Signature Regions
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
              Featured Destinations
            </h2>
          </div>
          <p className="text-sm text-[#252A27]/70 max-w-md">
            From the cool peaks of the Western Ghats to quiet backwaters and coastal peninsulas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              href={`/packages?search=${encodeURIComponent(dest.filterSlug)}`}
              className="group relative flex flex-col h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173F35] via-[#173F35]/40 to-transparent" />

              <div className="relative z-10 mt-auto p-5 text-white flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#F7F5EF] group-hover:text-[#C58B63] transition-colors">
                    {dest.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-xs text-[#D9E2D8] font-medium mt-1 mb-2">
                  {dest.tagline}
                </p>
                <p className="text-[11px] text-[#F7F5EF]/80 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Ship, Trees, Compass, Sparkles, ArrowRight } from "lucide-react";

interface ExperienceItem {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  image: string;
  tag: string;
  searchQuery: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    title: "Backwater Houseboats",
    subtitle: "Private Luxury Kettuvallam Journeys",
    description:
      "Drift past quiet village waterways in an air-conditioned handcrafted wooden barge with private onboard chef preparing fresh Malabar delicacies.",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    tag: "Signature Journey",
    searchQuery: "houseboat",
  },
  {
    title: "Tea & Spice Plantations",
    subtitle: "Highland Estates of Munnar & Thekkady",
    description:
      "Walk among century-old tea gardens, explore antique processing factories, and breathe in fresh mountain air scented with cardamom and clove.",
    icon: Trees,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    tag: "High Range",
    searchQuery: "munnar",
  },
  {
    title: "Rainforest & Wildlife",
    subtitle: "Periyar & Wayanad Bio-Reserves",
    description:
      "Lake boat safaris spotting wild elephant herds, endemic bird species, and guided nature treks with certified forest rangers.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
    tag: "Eco Wildlife",
    searchQuery: "wildlife",
  },
  {
    title: "Cultural Heritage",
    subtitle: "Kathakali, Temples & Colonial Ports",
    description:
      "Vibrant Kathakali dance rituals, ancient Dravidian temple architecture, and European colonial history in Fort Kochi.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    tag: "Living Culture",
    searchQuery: "heritage",
  },
];

export function Experiences() {
  return (
    <section id="experiences" className="py-24 bg-[#F7F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63] block mb-2">
            The Kerala Way of Life
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
            Curated Experiences
          </h2>
          <p className="text-sm text-[#252A27]/70 mt-3 leading-relaxed">
            Every itinerary is woven around meaningful South Indian moments that leave a lasting imprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERIENCES.map((exp) => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.title}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#D9E2D8] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#173F35]/90 backdrop-blur-md text-[11px] font-medium text-[#F7F5EF]">
                      <Icon className="w-3 h-3 text-[#C58B63]" />
                      {exp.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#173F35] group-hover:text-[#C58B63] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#C58B63] uppercase tracking-wider mt-1">
                      {exp.subtitle}
                    </p>
                    <p className="text-xs text-[#252A27]/70 mt-2.5 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/packages?search=${encodeURIComponent(exp.searchQuery)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173F35] group-hover:text-[#C58B63] transition-colors"
                    >
                      <span>Explore Itineraries</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


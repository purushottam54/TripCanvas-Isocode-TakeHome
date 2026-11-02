import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { ShieldCheck, HeartHandshake, Compass, Trees } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63]">
            Our Heritage & Purpose
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#173F35]">
            About TripCanvas
          </h1>
          <p className="text-base text-[#252A27]/80 leading-relaxed font-light">
            Founded in Fort Kochi, TripCanvas was created to bring clarity, editorial craftsmanship, and authentic South Indian warmth to bespoke travel. We eliminate the frustration of opaque pricing and cookie-cutter tourist trails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#D9E2D8] space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#173F35]" />
            <h3 className="font-serif text-lg font-bold text-[#173F35]">
              Transparent Seasonal Pricing
            </h3>
            <p className="text-xs text-[#252A27]/70 leading-relaxed">
              Every rate comes straight from published hotel contracts with clear disclosures for GST, twin-sharing basis, and child policies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#D9E2D8] space-y-3">
            <Compass className="w-6 h-6 text-[#C58B63]" />
            <h3 className="font-serif text-lg font-bold text-[#173F35]">
              AI-Assisted, Human-Perfected
            </h3>
            <p className="text-xs text-[#252A27]/70 leading-relaxed">
              Our travel consultants use responsible AI to extract preferences, but every quote is verified and customized by an experienced local consultant.
            </p>
          </div>
        </div>

        <div className="bg-[#ede8db]/60 p-8 rounded-3xl border border-[#D9E2D8] space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#173F35]">
            Our Kochi Travel Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#252A27]/80 leading-relaxed">
            Client: Company A, Kochi. This platform is developed as a production-quality take-home assignment demonstrating end-to-end full-stack engineering, versioned CMS architecture, deterministic package matching, and role-based access control.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35]">
            <Shield className="w-3.5 h-3.5 text-[#C58B63]" />
            DPDP Act 2023 Compliance
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
            Privacy & Data Protection Notice
          </h1>
          <p className="text-xs text-[#252A27]/60">
            Last updated: November 2026
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#D9E2D8] space-y-6 text-xs sm:text-sm text-[#252A27]/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              1. Commitment to Data Privacy
            </h2>
            <p>
              TripCanvas (Client: Company A, Kochi) operates in strict alignment with India's Digital Personal Data Protection (DPDP) Act 2023. We collect only minimal required travel preferences (such as names, dates, passenger counts, and contact coordinates) strictly for creating customized holiday quotations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              2. Consent for Communications
            </h2>
            <p>
              When submitting an enquiry, travellers explicitly opt-in for email or WhatsApp follow-ups. You may withdraw consent at any time by replying to our tour consultant or emailing privacy@tripcanvas.internal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              3. Data Minimization & AI Security
            </h2>
            <p>
              Customer enquiry messages processed by our server-side Google Gemini service are evaluated without retaining permanent training weights. API credentials remain strictly confined to backend servers and are never exposed to browser runtimes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              4. Security Measures
            </h2>
            <p>
              We implement PostgreSQL Row Level Security (RLS), cryptographic session tokens, server-side Zod validation, and IP-based rate limiting to prevent spam and data leaks.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}


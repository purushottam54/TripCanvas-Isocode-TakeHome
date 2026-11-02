import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { EnquiryForm } from "@/components/public/EnquiryForm";
import { Compass, Sparkles } from "lucide-react";

export const metadata = {
  title: "Plan Your Journey | TripCanvas Enquiry",
  description:
    "Submit your travel requirements to TripCanvas Kochi. Our senior tour consultants prepare transparent, personalized proposals.",
};

export default function GeneralEnquirePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35]">
            <Sparkles className="w-3.5 h-3.5 text-[#C58B63]" />
            Direct Consultation Desk
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35] tracking-tight">
            Plan Your Journey
          </h1>
          <p className="text-xs sm:text-sm text-[#252A27]/70 leading-relaxed">
            Tell us about your dates, preferred experiences (such as Alleppey houseboats or Munnar tea estates), and group size. A senior tour consultant will review and prepare a transparent proposal.
          </p>
        </div>

        <EnquiryForm defaultDestination="Kerala" />
      </main>

      <Footer />
    </div>
  );
}

import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Terms of Travel Booking
        </h1>
        <div className="bg-white p-8 rounded-3xl border border-[#D9E2D8] space-y-6 text-xs sm:text-sm text-[#252A27]/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              1. Transparent Pricing & Inclusions
            </h2>
            <p>
              All published package rates on TripCanvas are calculated on a per-person twin sharing basis in Indian Rupees (INR) unless expressly stated otherwise. Statutory Goods and Services Tax (GST at 5%) is applicable additionally on total invoice values.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              2. Child Occupancy & Extra Bed Rules
            </h2>
            <p>
              In accordance with hotel and houseboat policies across Kerala, children below 5 years complimentary sharing existing parent bedding. Child rates with an extra rollaway mattress require confirmation from our tour consultant desk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              3. Versioned Itineraries
            </h2>
            <p>
              TripCanvas maintains immutable version records for all published packages. Confirmed traveller bookings are bound to the exact published version active at the time of reservation confirmation.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

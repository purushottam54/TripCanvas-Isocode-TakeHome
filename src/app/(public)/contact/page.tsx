import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63]">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#173F35]">
            Contact Our Kochi Desk
          </h1>
          <p className="text-base text-[#252A27]/80 leading-relaxed font-light">
            Whether you are planning a honeymoon houseboat stay or an extended temple pilgrimage, our tour consultants are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#D9E2D8] shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#173F35]">
              Demo Operations Office
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#252A27]/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C58B63] shrink-0 mt-0.5" />
                <span>
                  Company A Demo Tour Desk
                  <br />
                  Princess Street, Fort Kochi,
                  <br />
                  Kerala 682001, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C58B63] shrink-0" />
                <span>+91 484 221 0000 (Demo Support Desk)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C58B63] shrink-0" />
                <span>enquiries@tripcanvas.internal</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C58B63] shrink-0" />
                <span>Monday – Saturday: 09:00 AM – 07:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="bg-[#173F35] text-[#F7F5EF] p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B63]">
                Prefer Direct Inquiry?
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Submit an Online Travel Request
              </h3>
              <p className="text-xs text-[#D9E2D8] leading-relaxed">
                Fill out our structured enquiry form to receive an automated AI-assisted recommendation and consultant proposal within 24 hours.
              </p>
            </div>

            <Link
              href="/enquire"
              className="inline-block text-center py-3.5 px-6 rounded-full bg-[#C58B63] text-white font-semibold text-xs sm:text-sm hover:bg-[#b5764d] transition-colors"
            >
              Open Enquiry Form
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


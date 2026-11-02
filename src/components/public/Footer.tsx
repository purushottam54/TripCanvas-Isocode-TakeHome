import Link from "next/link";
import { Mail, Phone, MapPin, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#173F35] text-[#F7F5EF] pt-16 pb-12 border-t border-[#14352d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2a554b]">
          {/* Brand & Editorial Ethos */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#C58B63] flex items-center justify-center text-[#173F35] font-serif text-lg font-bold">
                T
              </div>
              <span className="font-serif text-2xl tracking-tight text-[#F7F5EF] font-semibold">
                TripCanvas
              </span>
            </div>
            <p className="text-xs text-[#D9E2D8]/80 leading-relaxed">
              Boutique South India tour operator based in Kochi, Kerala. Crafting authentic, unhurried
              journeys across tranquil backwaters, tea-clad Western Ghats, and storied temple coastlines.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a554b] text-[11px] text-[#D9E2D8]">
                <Shield className="w-3 h-3 text-[#C58B63]" />
                Demo Tour Operator Platform
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C58B63] mb-4">
              Explore Journeys
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9E2D8]">
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  All Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/packages/munnar-thekkady-alleppey-houseboat" className="hover:text-white transition-colors">
                  Munnar & Alleppey Houseboat (6D)
                </Link>
              </li>
              <li>
                <Link href="/packages/wayanad-rainforest-and-wildlife" className="hover:text-white transition-colors">
                  Wayanad Rainforest Retreat (4D)
                </Link>
              </li>
              <li>
                <Link href="/packages/kochi-heritage-and-marari-beach" className="hover:text-white transition-colors">
                  Fort Kochi & Marari Beach (4D)
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="hover:text-white transition-colors">
                  Top Kerala Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Staff & Company Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C58B63] mb-4">
              Company & Staff
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9E2D8]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TripCanvas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Tour Desk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#C58B63] font-medium transition-colors">
                  Staff Login (CMS & Enquiries)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  DPDP Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Travel Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Labelled Demo Contact Info */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#C58B63] mb-4">
              Kochi Desk (Demo)
            </h4>
            <div className="space-y-3 text-xs text-[#D9E2D8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C58B63] shrink-0 mt-0.5" />
                <span>
                  Company A Demo Operator,
                  <br />
                  Princess Street, Fort Kochi,
                  <br />
                  Kerala 682001, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C58B63] shrink-0" />
                <span>+91 484 221 0000 (Demo Desk)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C58B63] shrink-0" />
                <span>enquiries@tripcanvas.internal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#D9E2D8]/60 gap-4">
          <p>
            © {new Date().getFullYear()} TripCanvas. Client: Company A, Kochi. Created for Software Engineering Internship at IsoCode Labs.
          </p>
          <p className="text-right">
            Per-person transparent pricing · Twin-sharing basis · Applicable GST disclosed · DPDP Act 2023 compliant
          </p>
        </div>
      </div>
    </footer>
  );
}

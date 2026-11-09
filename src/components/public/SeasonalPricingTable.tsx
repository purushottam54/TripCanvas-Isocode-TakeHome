import { SeasonalPrice } from "@/types/package";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Info, Calendar } from "lucide-react";

interface SeasonalPricingTableProps {
  prices: SeasonalPrice[];
  priceBasis?: string;
  gstDisclosure?: string;
}

export function SeasonalPricingTable({
  prices,
  priceBasis = "per person on twin sharing basis",
  gstDisclosure = "5% GST applicable additionally",
}: SeasonalPricingTableProps) {
  if (!prices || prices.length === 0) {
    return (
      <div className="bg-[#ede8db]/50 p-6 rounded-2xl border border-[#D9E2D8] text-center">
        <p className="text-sm text-[#252A27]/70">
          Seasonal pricing is currently being finalized by our tour consultants.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden bg-white rounded-2xl border border-[#D9E2D8] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#173F35] text-[#F7F5EF] text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-5">Season & Period</th>
              <th className="py-3.5 px-5">Applicable Months</th>
              <th className="py-3.5 px-5 text-right">Published Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9E2D8]/60 text-sm text-[#252A27]">
            {prices.map((p, idx) => (
              <tr
                key={p.id || idx}
                className="hover:bg-[#F7F5EF]/50 transition-colors"
              >
                <td className="py-4 px-5">
                  <div className="font-semibold text-[#173F35] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C58B63]" />
                    {p.seasonName}
                  </div>
                  {p.description && (
                    <p className="text-xs text-[#252A27]/60 mt-1 max-w-sm">
                      {p.description}
                    </p>
                  )}
                </td>
                <td className="py-4 px-5 text-xs text-[#252A27]/80">
                  {p.startMonth && p.endMonth
                    ? getMonthRangeLabel(p.startMonth, p.endMonth)
                    : "Standard Year-Round"}
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="font-serif text-xl font-bold text-[#173F35]">
                    {formatCurrency(p.pricePerPerson, p.currency)}
                  </div>
                  <div className="text-[10px] text-[#252A27]/60 font-medium">
                    {priceBasis}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transparent Disclosures Box */}
      <div className="bg-[#F7F5EF] rounded-2xl p-5 border border-[#D9E2D8] space-y-3">
        <div className="flex items-start gap-2.5 text-xs text-[#252A27]/80">
          <ShieldCheck className="w-4 h-4 text-[#173F35] shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Tax:</strong> {gstDisclosure}. Transparent invoice breakdown provided with no hidden charges.
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-[#252A27]/80">
          <Info className="w-4 h-4 text-[#C58B63] shrink-0 mt-0.5" />
          <span>
            <strong>Child Occupancy:</strong> Child pricing requires confirmation based on individual resort extra-bed and breakfast policies.
          </span>
        </div>
      </div>
    </div>
  );
}

function getMonthRangeLabel(start: number, end: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${months[start - 1]} – ${months[end - 1]}`;
}


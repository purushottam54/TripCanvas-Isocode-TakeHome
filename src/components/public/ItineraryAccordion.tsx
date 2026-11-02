"use client";

import { useState } from "react";
import { ItineraryDay } from "@/types/package";
import { ChevronDown, MapPin, Bed, Utensils } from "lucide-react";

interface ItineraryAccordionProps {
  days: ItineraryDay[];
}

export function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 1: true });

  const toggleDay = (day: number) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    days.forEach((d) => (all[d.day] = true));
    setOpenDays(all);
  };

  const collapseAll = () => {
    setOpenDays({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#D9E2D8]">
        <span className="text-xs font-medium text-[#252A27]/60">
          {days.length} Days Day-Wise Schedule
        </span>
        <div className="space-x-3 text-xs">
          <button
            onClick={expandAll}
            className="text-[#173F35] font-semibold hover:underline"
          >
            Expand All
          </button>
          <span className="text-[#D9E2D8]">|</span>
          <button
            onClick={collapseAll}
            className="text-[#252A27]/60 hover:text-[#173F35]"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {days.map((item) => {
          const isOpen = !!openDays[item.day];
          return (
            <div
              key={item.day}
              className="bg-white rounded-2xl border border-[#D9E2D8] overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleDay(item.day)}
                className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-[#F7F5EF]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#173F35] text-[#F7F5EF] text-xs font-bold flex items-center justify-center shrink-0">
                    D{item.day}
                  </span>
                  <span className="font-serif text-base font-bold text-[#173F35]">
                    {item.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#C58B63] transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-[#D9E2D8]/40 space-y-3 text-xs sm:text-sm text-[#252A27]/80 leading-relaxed">
                  <p>{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#252A27]/70">
                    {item.stay && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ede8db]/50">
                        <Bed className="w-3.5 h-3.5 text-[#C58B63]" />
                        <span>Stay: {item.stay}</span>
                      </span>
                    )}
                    {item.meals && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ede8db]/50">
                        <Utensils className="w-3.5 h-3.5 text-[#C58B63]" />
                        <span>Meals: {item.meals}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

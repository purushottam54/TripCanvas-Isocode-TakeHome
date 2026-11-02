"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";

interface EnquiryFormProps {
  packageId?: string | null;
  packageSlug?: string | null;
  packageTitle?: string | null;
  defaultDestination?: string;
}

export function EnquiryForm({
  packageId,
  packageSlug,
  packageTitle,
  defaultDestination = "Kerala",
}: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    destination: defaultDestination,
    travelStartDate: "",
    travelDuration: "5-6 nights",
    adultsCount: 2,
    childrenCount: 0,
    budget: "",
    currency: "INR",
    specialRequirements: "",
    whatsappConsent: true,
    websiteUrl: "", // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    enquiryNumber: string;
    fullName: string;
    destination: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        packageId: packageId || null,
        packageSlug: packageSlug || null,
        adultsCount: Number(formData.adultsCount),
        childrenCount: Number(formData.childrenCount),
        budget: formData.budget ? Number(formData.budget) : null,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setSubmittedResult({
        enquiryNumber: data.enquiry.enquiryNumber,
        fullName: data.enquiry.fullName,
        destination: data.enquiry.destination,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D9E2D8] shadow-lg text-center space-y-6 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-[#173F35]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C58B63] font-semibold">
            Submission Confirmed
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#173F35]">
            Namaskaram, {submittedResult.fullName}
          </h3>
          <p className="text-sm text-[#252A27]/70 leading-relaxed">
            Your travel enquiry has been registered in our reservation system under reference:
          </p>
          <div className="inline-block py-2 px-5 rounded-full bg-[#F7F5EF] border border-[#D9E2D8] font-mono text-sm font-bold text-[#173F35] tracking-wider my-2">
            {submittedResult.enquiryNumber}
          </div>
        </div>

        <div className="bg-[#F7F5EF] p-5 rounded-2xl text-xs text-left text-[#252A27]/80 space-y-2 border border-[#D9E2D8]/60">
          <div className="flex items-center gap-2 text-[#173F35] font-semibold">
            <Sparkles className="w-4 h-4 text-[#C58B63]" />
            What Happens Next:
          </div>
          <p>
            1. An acknowledgement record has been logged in our internal system.
          </p>
          <p>
            2. A Senior Tour Consultant in Kochi has been assigned to verify dates, resort availability, and draft a transparent quote.
          </p>
          <p className="text-[11px] text-[#252A27]/60 italic">
            * Note: For privacy and sandbox demo boundaries, external automated emails/SMS are simulated in the consultant inbox.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/packages"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#173F35] text-[#F7F5EF] text-xs font-semibold hover:bg-[#14352d] transition-colors"
          >
            Explore More Packages
          </Link>
          <button
            onClick={() => {
              setSubmittedResult(null);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                destination: defaultDestination,
                travelStartDate: "",
                travelDuration: "5-6 nights",
                adultsCount: 2,
                childrenCount: 0,
                budget: "",
                currency: "INR",
                specialRequirements: "",
                whatsappConsent: true,
                websiteUrl: "",
              });
            }}
            className="text-xs text-[#252A27]/70 hover:text-[#173F35] underline"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E2D8] shadow-md space-y-6 max-w-2xl mx-auto"
    >
      {/* Package Header Banner if enquired from package detail */}
      {packageTitle && (
        <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C58B63]">
              Enquiring For Package
            </span>
            <div className="font-serif font-bold text-[#173F35] text-base">
              {packageTitle}
            </div>
          </div>
          <span className="text-xs font-mono text-[#252A27]/60">
            {packageId}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot field (hidden from genuine users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="websiteUrl">Leave this empty</label>
        <input
          id="websiteUrl"
          type="text"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Rohan Sharma"
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. rohan.sharma@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Target Destination <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g. Kerala, Munnar & Alleppey"
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Travel Start Date */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Travel Start Date (or Month)
          </label>
          <input
            type="date"
            value={formData.travelStartDate}
            onChange={(e) => setFormData({ ...formData, travelStartDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Travel Duration */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Duration (Nights / Days)
          </label>
          <input
            type="text"
            value={formData.travelDuration}
            onChange={(e) => setFormData({ ...formData, travelDuration: e.target.value })}
            placeholder="e.g. 5-6 nights"
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        {/* Adults & Children */}
        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Adults (12+ yrs) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={30}
            required
            value={formData.adultsCount}
            onChange={(e) => setFormData({ ...formData, adultsCount: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
            Children (below 12 yrs)
          </label>
          <input
            type="number"
            min={0}
            max={20}
            value={formData.childrenCount}
            onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>
      </div>

      {/* Target Total Budget in INR */}
      <div>
        <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
          Estimated Overall Budget (INR, Optional)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-sm text-[#252A27]/60">₹</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g. 120000"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
          />
        </div>
        <p className="text-[11px] text-[#252A27]/60 mt-1">
          Helps our AI assistant recommend packages matching your preferred tier.
        </p>
      </div>

      {/* Special Requirements */}
      <div>
        <label className="block text-xs font-semibold text-[#173F35] uppercase tracking-wider mb-1.5">
          Special Requirements & Desired Experiences
        </label>
        <textarea
          rows={3}
          value={formData.specialRequirements}
          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
          placeholder="e.g. Houseboat stay is a must, vegetarian meals preferred, need extra bed for child."
          className="w-full px-4 py-2.5 rounded-xl border border-[#D9E2D8] text-sm text-[#252A27] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
        />
      </div>

      {/* DPDP Act 2023 WhatsApp & Followup Consent */}
      <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8]/60 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.whatsappConsent}
            onChange={(e) => setFormData({ ...formData, whatsappConsent: e.target.checked })}
            className="mt-0.5 rounded text-[#173F35] focus:ring-[#173F35] h-4 w-4"
          />
          <span className="text-xs text-[#252A27]/80">
            <strong>Consent for Travel Follow-up:</strong> I agree to receive transparent tour proposals and itinerary updates via WhatsApp / Email under the Digital Personal Data Protection (DPDP) Act 2023. We never spam.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-full bg-[#173F35] text-[#F7F5EF] font-semibold text-sm hover:bg-[#14352d] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Enquiry to Tour Desk...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Travel Enquiry</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#252A27]/60">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C58B63]" />
        <span>Your data is stored securely. No online booking payment requested upfront.</span>
      </div>
    </form>
  );
}

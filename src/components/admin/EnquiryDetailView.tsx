"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EnquiryRecord, EnquiryNote, EnquiryMessage, EnquiryStatus } from "@/types/enquiry";
import { AiExtractionRecord, PackageSuggestionRecord } from "@/types/ai";
import { UserProfile } from "@/types/auth";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Save,
  Check,
  ShieldCheck,
  HelpCircle,
  Loader2,
  FileText,
  Mail,
  ChevronRight,
} from "lucide-react";

interface EnquiryDetailViewProps {
  enquiry: EnquiryRecord;
  aiExtraction: AiExtractionRecord | null;
  suggestions: PackageSuggestionRecord[];
  notes: EnquiryNote[];
  messages: EnquiryMessage[];
  currentUser: UserProfile;
}

export function EnquiryDetailView({
  enquiry,
  aiExtraction,
  suggestions,
  notes,
  messages,
  currentUser,
}: EnquiryDetailViewProps) {
  const router = useRouter();

  // Status & Assignment
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [statusLoading, setStatusLoading] = useState(false);

  // Editable AI Fields
  const [aiFields, setAiFields] = useState({
    destination: aiExtraction?.destination || enquiry.destination,
    arrivalDateOrMonth: aiExtraction?.arrivalDateOrMonth || "Flexible",
    duration: aiExtraction?.duration || enquiry.travelDuration || "",
    adultsCount: aiExtraction?.adultsCount ?? enquiry.adultsCount,
    childrenCount: aiExtraction?.childrenCount ?? enquiry.childrenCount,
    budget: aiExtraction?.budget ?? enquiry.budget ?? "",
    specialRequirements: aiExtraction?.specialRequirements || enquiry.specialRequirements || "",
  });
  const [aiSaveLoading, setAiSaveLoading] = useState(false);
  const [aiSavedSuccess, setAiSavedSuccess] = useState(false);

  // New Note
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  // Selected Package for reply drafting
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    suggestions[0]?.packageId || enquiry.packageId || "PKG-KL-07"
  );

  // AI Reply Draft
  const [draftingReply, setDraftingReply] = useState(false);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [approvingReply, setApprovingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  // Check if there is already an existing draft or message
  const aiDraftMsg = messages.find((m) => m.isAiDraft && !m.isApproved);
  const latestApprovedMsg = messages.filter((m) => m.isApproved).slice(-1)[0];

  // Update Status
  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    setStatus(newStatus);
    setStatusLoading(true);
    try {
      await fetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (err: any) {
      alert("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // Save Consultant Correction to AI Extracted Fields
  const handleSaveAiCorrections = async () => {
    setAiSaveLoading(true);
    setAiSavedSuccess(false);
    try {
      await fetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiExtractionUpdate: {
            destination: aiFields.destination,
            arrivalDateOrMonth: aiFields.arrivalDateOrMonth,
            duration: aiFields.duration,
            adultsCount: Number(aiFields.adultsCount),
            childrenCount: Number(aiFields.childrenCount),
            budget: aiFields.budget ? Number(aiFields.budget) : null,
            specialRequirements: aiFields.specialRequirements,
          },
        }),
      });
      setAiSavedSuccess(true);
      router.refresh();
    } catch (err: any) {
      alert("Failed to save correction");
    } finally {
      setAiSaveLoading(false);
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteLoading(true);
    try {
      await fetch(`/api/enquiries/${enquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText.trim() }),
      });
      setNoteText("");
      router.refresh();
    } catch (err: any) {
      alert("Failed to add note");
    } finally {
      setNoteLoading(false);
    }
  };

  // Generate AI Reply Draft
  const handleGenerateReplyDraft = async () => {
    setDraftingReply(true);
    setReplySuccessMessage(null);
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}/draft-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPackageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to draft reply");

      setDraftSubject(data.message.subject);
      setDraftBody(data.message.body);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDraftingReply(false);
    }
  };

  // Explicit Consultant Approval
  const handleApproveReply = async (msgId: string) => {
    if (!confirm("Confirm approval of this reply? This logs an approved communication record and marks enquiry as 'Replied'.")) {
      return;
    }
    setApprovingReply(true);
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}/approve-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msgId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve reply");

      setReplySuccessMessage("Reply approved and simulated message record created.");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApprovingReply(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2D8]">
        <div>
          <Link
            href="/admin/enquiries"
            className="text-xs text-[#252A27]/60 hover:text-[#173F35] flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Enquiry Inbox
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-1 bg-[#173F35] text-[#F7F5EF] rounded-md font-bold">
              {enquiry.enquiryNumber}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
              {enquiry.fullName}
            </h1>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#173F35] uppercase tracking-wider">
            Status:
          </span>
          <select
            value={status}
            disabled={statusLoading}
            onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#D9E2D8] bg-white text-[#173F35] shadow-sm focus:ring-1 focus:ring-[#173F35]"
          >
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {replySuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{replySuccessMessage}</span>
        </div>
      )}

      {/* Grid Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Original Message + AI Extractions + AI Reply */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. ORIGINAL CUSTOMER MESSAGE (Always Visible) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E2D8]/60 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C58B63]" />
                Original Traveller Enquiry Message
              </span>
              <span className="text-xs font-mono text-[#252A27]/50">
                Received: {formatDateTime(enquiry.createdAt)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8]/80 text-sm text-[#252A27] font-serif leading-relaxed italic">
              &quot;{enquiry.specialRequirements || "Customer submitted without custom note."}&quot;
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#252A27]/80 pt-1">
              <div>
                <span className="text-[10px] text-[#252A27]/50 block">Customer Email</span>
                <span className="font-semibold text-[#173F35]">{enquiry.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#252A27]/50 block">Phone / WhatsApp</span>
                <span className="font-semibold text-[#173F35]">{enquiry.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#252A27]/50 block">DPDP Consent</span>
                <span className="font-semibold text-emerald-700">
                  {enquiry.whatsappConsent ? "WhatsApp Opted In" : "Email Only"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#252A27]/50 block">Submission Channel</span>
                <span className="font-semibold text-[#173F35] uppercase">{enquiry.channel}</span>
              </div>
            </div>
          </div>

          {/* 2. AI EXTRACTIONS & CONSULTANT CORRECTIONS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#D9E2D8]/60 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#173F35]" />
                <h2 className="font-serif text-lg font-bold text-[#173F35]">
                  AI Extracted Parameters
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {aiExtraction && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      aiExtraction.reviewNeeded
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {aiExtraction.reviewNeeded ? "Review Recommended" : "Confident Match"}
                  </span>
                )}
                {aiExtraction?.confidenceScore && (
                  <span className="text-[10px] font-mono text-[#252A27]/60">
                    ({Math.round(aiExtraction.confidenceScore * 100)}% conf)
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#252A27]/70">
              Extracted automatically by server-side Gemini. Consultants can fine-tune or correct these fields below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Destination Region
                </label>
                <input
                  type="text"
                  value={aiFields.destination}
                  onChange={(e) => setAiFields({ ...aiFields, destination: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Travel Month / Dates
                </label>
                <input
                  type="text"
                  value={aiFields.arrivalDateOrMonth}
                  onChange={(e) => setAiFields({ ...aiFields, arrivalDateOrMonth: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Duration (Days / Nights)
                </label>
                <input
                  type="text"
                  value={aiFields.duration}
                  onChange={(e) => setAiFields({ ...aiFields, duration: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Adults (Count)
                </label>
                <input
                  type="number"
                  min={1}
                  value={aiFields.adultsCount}
                  onChange={(e) => setAiFields({ ...aiFields, adultsCount: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Children (Count)
                </label>
                <input
                  type="number"
                  min={0}
                  value={aiFields.childrenCount}
                  onChange={(e) => setAiFields({ ...aiFields, childrenCount: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#173F35] mb-1">
                  Budget (INR)
                </label>
                <input
                  type="number"
                  value={aiFields.budget}
                  onChange={(e) => setAiFields({ ...aiFields, budget: e.target.value })}
                  placeholder="e.g. 120000"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] font-medium text-[#173F35]"
                />
              </div>
            </div>

            {/* Required Experiences */}
            {aiExtraction?.requiredExperiences && aiExtraction.requiredExperiences.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-[#252A27]/60 block mb-1.5">
                  Detected Key Experiences
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiExtraction.requiredExperiences.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#ede8db] text-[#173F35] text-xs font-semibold"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#D9E2D8]/60">
              {aiSavedSuccess ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Corrections saved successfully!
                </span>
              ) : (
                <span className="text-[11px] text-[#252A27]/50 italic">
                  Model: {aiExtraction?.modelInfo || "standard"}
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveAiCorrections}
                disabled={aiSaveLoading}
                className="px-4 py-2 rounded-xl bg-[#173F35] text-white text-xs font-semibold hover:bg-[#14352d] flex items-center gap-1.5 shadow-sm disabled:opacity-60"
              >
                {aiSaveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Consultant Corrections</span>
              </button>
            </div>
          </div>

          {/* 3. AI REPLY DRAFTING & APPROVAL WORKFLOW */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#D9E2D8]/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C58B63]" />
                <h2 className="font-serif text-lg font-bold text-[#173F35]">
                  AI-Assisted Editorial Reply Workflow
                </h2>
              </div>
              <span className="text-[10px] text-[#C58B63] font-bold uppercase tracking-wider">
                Strict DB Pricing
              </span>
            </div>

            <p className="text-xs text-[#252A27]/70 leading-relaxed">
              Generate an elegant editorial proposal using the customer details and package prices retrieved strictly from PostgreSQL. Gemini is prohibited from calculating or inventing numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full text-xs">
                <label className="block font-semibold text-[#173F35] mb-1">
                  Select Base Package For Quote:
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] bg-white font-medium text-[#173F35]"
                >
                  {suggestions.map((sug) => (
                    <option key={sug.packageId} value={sug.packageId}>
                      {sug.packageTitle} ({formatCurrency(sug.startingPrice)}/pp · Score: {sug.score})
                    </option>
                  ))}
                  <option value="PKG-KL-07">PKG-KL-07: Munnar, Thekkady and Alleppey Houseboat</option>
                  <option value="PKG-KL-03">PKG-KL-03: Wayanad Rainforest Retreat & Wildlife</option>
                  <option value="PKG-KL-05">PKG-KL-05: Kochi Heritage & Marari Beach Solitude</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateReplyDraft}
                disabled={draftingReply}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#173F35] text-white text-xs font-semibold hover:bg-[#14352d] transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 mt-5 disabled:opacity-60"
              >
                {draftingReply ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C58B63]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#C58B63]" />
                )}
                <span>Generate Editorial Draft</span>
              </button>
            </div>

            {/* Editable Draft View if available */}
            {(draftBody || aiDraftMsg) && (
              <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#173F35] uppercase text-[10px] tracking-wider">
                    Draft Proposal Message (Editable)
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                    Requires Consultant Approval
                  </span>
                </div>

                <input
                  type="text"
                  value={draftSubject || aiDraftMsg?.subject || ""}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  placeholder="Proposal Subject"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] bg-white font-semibold text-xs text-[#173F35]"
                />

                <textarea
                  rows={10}
                  value={draftBody || aiDraftMsg?.body || ""}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D9E2D8] bg-white text-xs leading-relaxed font-mono"
                />

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-[#252A27]/60 italic">
                    * Sending is simulated in local demo environment. No external WhatsApp/email delivered.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleApproveReply(aiDraftMsg?.id || "draft-temp")}
                    disabled={approvingReply}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                  >
                    {approvingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Approve & Record Outgoing Proposal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Deterministic Package Recommendations & Notes */}
        <div className="space-y-8">
          {/* DETERMINISTIC PACKAGE SUGGESTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-[#D9E2D8] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#D9E2D8]/60 pb-3">
              <Bot className="w-4 h-4 text-[#C58B63]" />
              <h3 className="font-serif text-lg font-bold text-[#173F35]">
                Suggested Packages
              </h3>
            </div>

            {suggestions.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#252A27]/60">
                No strong automatic match found for this criteria. Consultant may search manually.
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((sug) => (
                  <div
                    key={sug.packageId}
                    className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8] space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-[#C58B63] font-bold">
                          {sug.packageId}
                        </span>
                        <div className="font-bold text-[#173F35] text-xs">
                          {sug.packageTitle}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#173F35] text-[#F7F5EF] text-[10px] font-bold">
                        {Math.round(sug.score)}% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-[#252A27]/70 font-semibold">
                      Base Rate: {formatCurrency(sug.startingPrice, sug.currency)} / person
                    </div>

                    {/* Reasons */}
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#252A27]/60 block">
                        Deterministic Match Reasons:
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#252A27]/80">
                        {sug.matchReasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/packages/${sug.packageSlug}`}
                        target="_blank"
                        className="text-[11px] font-semibold text-[#173F35] hover:underline flex items-center gap-1"
                      >
                        Inspect Itinerary <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INTERNAL CONSULTANT NOTES */}
          <div className="bg-white rounded-3xl p-6 border border-[#D9E2D8] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#173F35] border-b border-[#D9E2D8]/60 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#C58B63]" />
              Internal Notes ({notes.length})
            </h3>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log internal conversation, room block check, or driver assignment..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9E2D8] focus:ring-1 focus:ring-[#173F35]"
              />
              <button
                type="submit"
                disabled={noteLoading || !noteText.trim()}
                className="w-full py-2 bg-[#173F35] text-white text-xs font-semibold rounded-xl hover:bg-[#14352d] disabled:opacity-50"
              >
                {noteLoading ? "Saving..." : "Add Internal Note"}
              </button>
            </form>

            {/* Note Timeline */}
            <div className="space-y-3 pt-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-[#F7F5EF] border border-[#D9E2D8]/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#252A27]/60">
                    <span className="font-semibold text-[#173F35]">{n.authorName}</span>
                    <span>{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-[#252A27]/80">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

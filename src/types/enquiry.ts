export type EnquiryStatus = "new" | "assigned" | "in_progress" | "replied" | "closed";

export interface EnquiryRecord {
  id: string;
  enquiryNumber: string; // e.g. ENQ-2026-001
  fullName: string;
  email: string;
  phone: string;
  packageId?: string | null;
  packageSlug?: string | null;
  destination: string;
  travelStartDate?: string | null;
  travelDuration?: string | null;
  adultsCount: number;
  childrenCount: number;
  budget?: number | null;
  currency: string;
  specialRequirements?: string | null;
  whatsappConsent: boolean;
  status: EnquiryStatus;
  assignedConsultantId?: string | null;
  assignedConsultantName?: string | null;
  responseDeadline: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  authorId?: string | null;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface EnquiryMessage {
  id: string;
  enquiryId: string;
  senderId?: string | null;
  senderName: string;
  subject?: string;
  body: string;
  isAiDraft: boolean;
  isApproved: boolean;
  approvedBy?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  sentSimulatedAt?: string | null;
  channel: string;
  createdAt: string;
}

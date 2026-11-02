import { notFound, redirect } from "next/navigation";
import { getEnquiryById } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { EnquiryDetailView } from "@/components/admin/EnquiryDetailView";

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewEnquiries")) {
    redirect("/admin/packages");
  }

  const { id } = await params;
  const data = await getEnquiryById(id);

  if (!data.enquiry) {
    notFound();
  }

  return (
    <EnquiryDetailView
      enquiry={data.enquiry}
      aiExtraction={data.aiExtraction}
      suggestions={data.suggestions}
      notes={data.notes}
      messages={data.messages}
      currentUser={user}
    />
  );
}

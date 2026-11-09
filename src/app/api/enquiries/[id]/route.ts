import { NextRequest, NextResponse } from "next/server";
import {
  getEnquiryById,
  updateEnquiryStatus,
  updateAiExtraction,
} from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewEnquiries")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { id } = await params;
  const data = await getEnquiryById(id);
  if (!data.enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canManageEnquiries")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    if (body.status || body.assignedConsultantId) {
      await updateEnquiryStatus(
        id,
        body.status,
        body.assignedConsultantId,
        user.email
      );
    }

    if (body.aiExtractionUpdate) {
      if (!hasPermission(user.role, "canEditAiExtraction")) {
        return NextResponse.json(
          { error: "Insufficient permission to edit AI extractions" },
          { status: 403 }
        );
      }
      await updateAiExtraction(id, body.aiExtractionUpdate, user.email);
    }

    const updated = await getEnquiryById(id);
    return NextResponse.json({ success: true, ...updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


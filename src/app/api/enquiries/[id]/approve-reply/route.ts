import { NextRequest, NextResponse } from "next/server";
import { approveAndSendReply } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canApproveReply")) {
    return NextResponse.json(
      { error: "Only authorized consultants or admins may approve reply drafts." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { messageId } = await req.json();

  if (!messageId) {
    return NextResponse.json({ error: "messageId is required." }, { status: 400 });
  }

  try {
    const approvedMsg = await approveAndSendReply(id, messageId, user.fullName, user.email);
    return NextResponse.json({ success: true, message: approvedMsg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

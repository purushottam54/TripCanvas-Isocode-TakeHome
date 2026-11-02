import { NextRequest, NextResponse } from "next/server";
import { addEnquiryNote } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewEnquiries")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { note } = await req.json();

  if (!note || note.trim().length === 0) {
    return NextResponse.json({ error: "Note content cannot be empty" }, { status: 400 });
  }

  try {
    const createdNote = await addEnquiryNote(id, note.trim(), user.fullName, user.email);
    return NextResponse.json({ success: true, note: createdNote }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { duplicatePackage } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canCreatePackage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const duplicated = await duplicatePackage(id, user.email);
    return NextResponse.json({ success: true, package: duplicated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getPackageById, saveDraft } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { packageEditorSchema } from "@/lib/validation/package";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pkg = await getPackageById(id);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }
  return NextResponse.json({ package: pkg });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canEditPackage")) {
    return NextResponse.json({ error: "Forbidden: You cannot edit packages." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const validated = packageEditorSchema.parse(body);

    const updated = await saveDraft(id, validated, user.email);
    return NextResponse.json({ success: true, package: updated });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

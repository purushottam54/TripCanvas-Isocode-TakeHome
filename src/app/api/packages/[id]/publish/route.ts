import { NextRequest, NextResponse } from "next/server";
import { publishPackage } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canPublishPackage")) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to publish packages." },
      { status: 403 }
    );
  }

  const { id } = await params;
  try {
    const published = await publishPackage(id, user.email);
    return NextResponse.json({
      success: true,
      package: published,
      message: `Version v${published.publishedVersion?.versionNumber} is now published and live.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

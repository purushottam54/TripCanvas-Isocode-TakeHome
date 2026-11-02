import { NextRequest, NextResponse } from "next/server";
import { getLegacyRedirects, addLegacyRedirect } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function GET() {
  const redirects = await getLegacyRedirects();
  return NextResponse.json({ redirects });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canManageRedirects")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const { sourcePath, targetPath } = await req.json();
      if (!sourcePath || !targetPath) {
        return NextResponse.json(
          { error: "Both sourcePath and targetPath are required." },
          { status: 400 }
        );
      }
      const item = await addLegacyRedirect(sourcePath, targetPath);
      return NextResponse.json({ success: true, redirect: item });
    }

    // CSV text upload support
    const csvText = await req.text();
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    let addedCount = 0;

    for (const line of lines) {
      if (line.toLowerCase().startsWith("source") || line.toLowerCase().startsWith("old_url")) {
        continue; // skip header
      }
      const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length >= 2 && parts[0] && parts[1]) {
        await addLegacyRedirect(parts[0], parts[1]);
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${addedCount} legacy redirects from CSV.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

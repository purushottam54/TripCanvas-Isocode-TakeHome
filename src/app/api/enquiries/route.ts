import { NextRequest, NextResponse } from "next/server";
import { enquiryFormSchema } from "@/lib/validation/enquiry";
import { submitEnquiry, getAllEnquiries } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

// Rate limiting map (in-memory, window 60s, max 10 requests per IP)
const ipRateLimits = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimits.get(ip);
  if (!entry || entry.expiresAt < now) {
    ipRateLimits.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewEnquiries")) {
    return NextResponse.json({ error: "Unauthorized access to enquiries." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const destination = searchParams.get("destination") || undefined;

  const enquiries = await getAllEnquiries({ status, destination });
  return NextResponse.json({ enquiries });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const validatedInput = enquiryFormSchema.parse(body);

    const record = await submitEnquiry(validatedInput);

    return NextResponse.json(
      {
        success: true,
        enquiry: record,
        message: "Enquiry submitted successfully. A confirmation record has been logged.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: err.message || "Failed to submit enquiry" }, { status: 500 });
  }
}


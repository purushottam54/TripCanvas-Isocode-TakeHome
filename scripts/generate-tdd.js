const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} = require("docx");

async function generateTDD() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // TITLE
          new Paragraph({
            text: "TRIPCANVAS — TECHNICAL DESIGN DOCUMENT",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Enterprise Travel Platform & Versioned Content Management System",
                italics: true,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // REPOSITORY & LIVE URL PLACEHOLDERS
          new Paragraph({
            children: [
              new TextRun({ text: "GitHub Repository URL: ", bold: true }),
              new TextRun({ text: "https://github.com/<ORGANIZATION>/tripcanvas (Placeholder)", color: "0000FF" }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Live Application URL: ", bold: true }),
              new TextRun({ text: "https://tripcanvas-demo.vercel.app (Placeholder)", color: "0000FF" }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Client: ", bold: true }),
              new TextRun("Company A, Kochi, Kerala"),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Document Author: ", bold: true }),
              new TextRun("Senior Full-Stack Engineer / Candidate for Software Engineering Internship, IsoCode Labs"),
            ],
            spacing: { after: 400 },
          }),

          // 1. PROBLEM STATEMENT
          new Paragraph({
            text: "1. Problem Statement & Business Context",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Company A is a boutique tour operator based in Fort Kochi, Kerala, specializing in curated Kerala and South India holidays (including Munnar tea hill stations, Thekkady wildlife sanctuaries, Alleppey backwater houseboats, and Tamil Nadu coastal pilgrimage trails). Prior to TripCanvas, Company A experienced several critical business bottlenecks:"
              ),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• High Developer Dependency: ", bold: true }),
              new TextRun("Itinerary updates and seasonal price changes required engineering intervention, causing multi-day marketing delays."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Enquiry Fragmentation & Slow Response: ", bold: true }),
              new TextRun("Traveller enquiries arrived randomly via web forms, direct email, and WhatsApp without centralized status tracking or SLAs, leading to missed opportunities."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Quote Inaccuracy & Manual Drafting: ", bold: true }),
              new TextRun("Consultants manually calculated seasonal pricing on spreadsheets, occasionally quoting outdated rates or miscommunicating child policy and GST requirements."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Lack of Version History: ", bold: true }),
              new TextRun("Live edits directly mutated public pages, making it impossible to resolve customer disputes regarding what itinerary or hotel category was active at the time of booking."),
            ],
            spacing: { after: 200 },
          }),

          // 2. SYSTEM ARCHITECTURE
          new Paragraph({
            text: "2. System Architecture",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "TripCanvas is engineered as a modern full-stack web application leveraging Next.js App Router, React Server Components, PostgreSQL via Supabase, and Google Gemini LLMs for operational intelligence. The system strictly isolates public read traffic from administrative mutation workflows."
              ),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Architectural Layers:\n", bold: true }),
              new TextRun("1. Public Presentation Layer: High-performance Next.js Server Components with automatic static optimization, streaming, and responsive editorial typography.\n"),
              new TextRun("2. API & Route Handler Layer: Validated endpoints using Zod, enforcing rate limiting, honeypot spam protection, and cookie-based role authorization.\n"),
              new TextRun("3. Core Business Services: Deterministic price calculation engine, package matching recommendation algorithm, and version rollback manager.\n"),
              new TextRun("4. AI Operational Layer: Server-side Google Gemini (@google/genai) for structured travel parameter extraction and editorial reply drafting.\n"),
              new TextRun("5. Persistence Layer: Supabase PostgreSQL with strict Row Level Security (RLS) policies, foreign key integrity, and immutable audit logs."),
            ],
            spacing: { after: 200 },
          }),

          // 3. TECHNOLOGY CHOICES & RATIONALE
          new Paragraph({
            text: "3. Technology Choices & Rationale",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Next.js App Router (TypeScript): ", bold: true }),
              new TextRun("Provides server components for under-2.5s initial page loads, SEO-friendly SSR, server actions, and route handlers within a unified single-repository codebase."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Tailwind CSS: ", bold: true }),
              new TextRun("Custom-configured with the luxury Kerala editorial palette: Forest Green (#173F35), Warm Ivory (#F7F5EF), Terracotta (#C58B63), Sage (#D9E2D8), and Charcoal (#252A27). Avoids generic templates in favor of a boutique, publication-grade aesthetic."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Supabase PostgreSQL & RLS: ", bold: true }),
              new TextRun("Enterprise-grade relational database providing native ACID transactions for version publishing, granular Row Level Security policies, and auditability."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Google Gemini API (@google/genai): ", bold: true }),
              new TextRun("Official Google Gen AI SDK used exclusively on server endpoints. Employs gemini-flash-lite-latest with graceful offline fallback to guarantee that external AI downtime never drops an enquiry or crashes the application."),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Vitest & React Testing Library: ", bold: true }),
              new TextRun("Blazing fast unit and integration testing engine ensuring pricing accuracy, authorization rules, and rollback immutability."),
            ],
            spacing: { after: 200 },
          }),

          // 4. DATABASE SCHEMA DESIGN
          new Paragraph({
            text: "4. Database Schema Design",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "The database is structured across 11 relational tables with foreign key cascades, unique constraints, and check expressions:\n" +
                "- profiles (id, email, full_name, role: admin|editor|consultant|traveller)\n" +
                "- packages (id: text PK e.g. PKG-KL-07, slug: text unique, published_version_id: FK, draft_version_id: FK)\n" +
                "- package_versions (id: UUID, package_id: FK, version_number: int, status: draft|published|archived, title, destination, duration_days, hotel_category, overview, itinerary: jsonb, inclusions: jsonb, exclusions: jsonb, photos: jsonb, route_map: jsonb, price_basis, gst_disclosure)\n" +
                "- package_version_prices (id: UUID, package_version_id: FK, season_name, start_month, end_month, price_per_person, currency, child_price_notes, description)\n" +
                "- enquiries (id: UUID, enquiry_number: text unique e.g. ENQ-2026-001, full_name, email, phone, package_id: FK, destination, travel_start_date, travel_duration, adults_count, children_count, budget, whatsapp_consent, status: new|assigned|in_progress|replied|closed, assigned_consultant_id: FK, response_deadline)\n" +
                "- ai_extractions (id: UUID, enquiry_id: FK, original_message, destination, arrival_date_or_month, duration, adults_count, children_count, budget, required_experiences: jsonb, extraction_status, review_needed, confidence_score, model_info)\n" +
                "- package_suggestions (id: UUID, enquiry_id: FK, package_id: FK, score, match_reasons: jsonb)\n" +
                "- enquiry_notes (id: UUID, enquiry_id: FK, author_id: FK, note)\n" +
                "- enquiry_messages (id: UUID, enquiry_id: FK, subject, body, is_ai_draft, is_approved, approved_by: FK, approved_at, sent_simulated_at)\n" +
                "- activity_logs (id: UUID, actor_email, action, entity_type, entity_id, metadata: jsonb, created_at)\n" +
                "- legacy_redirects (id: UUID, source_path: unique, target_path, status_code: 301)"
              ),
            ],
            spacing: { after: 200 },
          }),

          // 5. VERSIONED CMS ARCHITECTURE
          new Paragraph({
            text: "5. Versioned CMS Architecture & Immutability",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Strict Separation of Published vs. Draft State: ", bold: true }),
              new TextRun(
                "A core requirement of TripCanvas is that editing a package must never immediately alter the live public website. The packages table maintains two distinct pointers: published_version_id and draft_version_id.\n\n" +
                "1. Creation: Creating a package creates Version 1 with status 'draft'.\n" +
                "2. Live Editing: Editors save draft changes onto draft_version_id. The public package page continues serving published_version_id uninterrupted.\n" +
                "3. Previewing: Staff can navigate to /admin/packages/[id]/preview to inspect the unpublished draft exactly as it will appear.\n" +
                "4. Transactional Publishing: When an administrator clicks 'Publish Live', the draft is validated, marked immutable with status 'published', the package's published_version_id is updated, and an activity log event is recorded.\n" +
                "5. Snapshot Rollback: Rolling back to an earlier version (e.g., from v2 back to v1) NEVER mutates historical records. Instead, a brand new version snapshot (v3) is created copying v1's content. History remains immutable and auditable."
              ),
            ],
            spacing: { after: 200 },
          }),

          // 6. AI ARCHITECTURE & STRICT PRICING RULES
          new Paragraph({
            text: "6. AI Architecture & Strict Pricing Safeguards",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• The Golden Rule of Pricing: ", bold: true }),
              new TextRun(
                "Google Gemini is NEVER permitted to calculate, invent, or determine package prices. All prices displayed in traveller quotes come strictly from package_version_prices in PostgreSQL.\n" +
                "• Deterministic Package Matching: Recommendations are ranked by a deterministic 100-point algorithm: Destination Match (up to 40 pts), Duration Fit (up to 20 pts), Budget Affordability (up to 25 pts), and Required Experiences (up to 15 pts). Only published packages can be recommended.\n" +
                "• AI Extraction & Failure Handling: Traveller enquiry messages are parsed into structured JSON via server-side Gemini. If the LLM response is malformed or times out, the intake service falls back to safe defaults, marks review_needed = true, and NEVER drops or blocks the enquiry.\n" +
                "• Human Approval Workflow: AI-generated editorial replies remain unapproved drafts until a human consultant explicitly inspects and clicks 'Approve & Record Outgoing Proposal'. External delivery is simulated."
              ),
            ],
            spacing: { after: 200 },
          }),

          // 7. ROLE-BASED ACCESS CONTROL (RBAC)
          new Paragraph({
            text: "7. Role-Based Access Control (RBAC)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun("Authorization is enforced at both the API/Server Action layer and PostgreSQL Row Level Security (RLS):\n" +
                "• Admin (e.g. Kavitha Nair): Full system access — package creation, publishing, rollback, enquiry management, consultant assignment, and audit logs.\n" +
                "• Editor (e.g. Arjun Menon): CMS package authoring, draft editing, itinerary & photo updates, draft previewing. Cannot manage user roles or approve customer quotes.\n" +
                "• Consultant (e.g. Deepa Kurian): CRM enquiry inbox access, correcting AI extractions, reviewing matched packages, adding internal notes, and approving reply drafts.\n" +
                "• Traveller: Public access only. Can view published packages and submit enquiries. Cannot view other travellers' enquiries or staff dashboards."
              ),
            ],
            spacing: { after: 200 },
          }),

          // 8. SECURITY & DPDP ACT 2023 COMPLIANCE
          new Paragraph({
            text: "8. Privacy & Security (DPDP Act 2023)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "• Explicit Consent Tracking: Enquiries record boolean consent for WhatsApp and email communication.\n" +
                "• Data Minimization: We collect only parameters necessary for travel itinerary creation.\n" +
                "• Zero Secret Leakage: Gemini and Supabase service credentials are never exposed through NEXT_PUBLIC_ variables.\n" +
                "• Honeypot & Rate Limiting: Forms include hidden honeypot fields to trap bots and IP rate limiting to mitigate spam.\n" +
                "• HTTPOnly Cookies: Staff session tokens are stored in secure HTTPOnly, SameSite cookies."
              ),
            ],
            spacing: { after: 200 },
          }),

          // 9. TESTING & VERIFICATION
          new Paragraph({
            text: "9. Testing & Quality Assurance",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "TripCanvas is backed by an automated Vitest test suite executing 15 unit and integration tests across 5 test suites:\n" +
                "1. Pricing Engine (tests/unit/pricing.test.ts): Verifies seasonal selection (Peak vs Monsoon) and transparent GST/child policy calculation.\n" +
                "2. Validation & Spam (tests/unit/validation.test.ts): Confirms rejection of invalid/honeypot submissions and successful persistence of valid enquiries.\n" +
                "3. AI & Matching (tests/unit/ai-recommendation.test.ts): Verifies that recommendations reference only published packages and AI fallback preserves enquiries.\n" +
                "4. Versioning & Immutability (tests/unit/versioning.test.ts): Confirms that draft changes do not pollute published live content, publishing updates pointers, and rollback creates new snapshots.\n" +
                "5. Authorization (tests/unit/authorization.test.ts): Verifies that public travellers and editors cannot perform unauthorized operations.\n" +
                "Result: All 15 tests executed and passing in automated CI."
              ),
            ],
            spacing: { after: 200 },
          }),

          // 10. ASSUMPTIONS, CUTS & FUTURE IMPROVEMENTS
          new Paragraph({
            text: "10. Assumptions, Features Cut & Future Roadmap",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Features Deliberately Cut: ", bold: true }),
              new TextRun(
                "Live payment gateways (Razorpay/Stripe) and live WhatsApp Business Cloud API integration were deliberately excluded to maintain sandbox safety and focus resources on core versioning, CRM, and pricing integrity.\n\n" +
                "• Assumptions: Travellers require consultant review for custom flight timings and child extra-bed policies. Per-person prices are benchmarked on double occupancy.\n\n" +
                "• Future Roadmap: Interactive Quote PDF Generator, Multi-Currency Real-Time Conversion, WhatsApp Webhook bi-directional syncing, and advanced analytics for enquiry-to-booking conversion rates."
              ),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("TDD.docx", buffer);
  console.log("Successfully generated TDD.docx");
}

generateTDD();

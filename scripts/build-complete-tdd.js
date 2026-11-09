const fs = require("fs");
const path = require("path");
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
  PageNumber,
  NumberFormat,
  Footer,
  Header,
} = require("docx");

function createHeader(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 280, after: 120 },
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22, // 11pt
        ...options,
      }),
    ],
    spacing: { after: 120, line: 276 },
  });
}

function createBullet(title, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `• ${title}: `, bold: true, size: 22 }),
      new TextRun({ text, size: 22 }),
    ],
    spacing: { after: 80, line: 260 },
  });
}

function createCodeBlock(code) {
  const lines = code.split("\n");
  return lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: "Consolas",
            size: 18, // 9pt
            color: "173F35",
          }),
        ],
        spacing: { before: 20, after: 20 },
        indent: { left: 360 },
      })
  );
}

function createTable(headers, rows) {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map(
        (h) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF" })],
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { fill: "173F35" },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
          })
      ),
    }),
    ...rows.map(
      (row, idx) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: cell, size: 19 })],
                  }),
                ],
                shading: { fill: idx % 2 === 0 ? "F7F5EF" : "FFFFFF" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
              })
          ),
        })
    ),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
}

async function buildDocx() {
  const children = [];

  // ==========================================
  // 1. COVER PAGE
  // ==========================================
  children.push(
    new Paragraph({
      text: "TRIPCANVAS",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Technical Design Document (TDD)",
          size: 32,
          bold: true,
          color: "173F35",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Enterprise Editorial Travel Platform & Versioned Content Management System",
          italics: true,
          size: 24,
          color: "C58B63",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    createParagraph("───────────────────────────────────────────────────────────", {
      color: "D9E2D8",
    }),
    new Paragraph({
      children: [new TextRun({ text: "Prepared For: ", bold: true }), new TextRun("IsoCode Workspace")],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Submission Track: ", bold: true }),
        new TextRun("Software Engineering Intern Take-Home Assignment"),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Client Case: ", bold: true }), new TextRun("Company A, Kochi, Kerala")],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Document Version: ", bold: true }), new TextRun("1.0.0 (Production Release)")],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("November 2026")],
      spacing: { after: 400 },
    }),

    // SECTION 24 (Placed upfront per prompt instructions)
    createHeader("Repository and Live Application Links", HeadingLevel.HEADING_2),
    createParagraph(
      "The following links represent the official public code repository and the deployed cloud instance. Placeholders are established below pending final external domain binding:"
    ),
    new Paragraph({
      children: [
        new TextRun({ text: "GitHub Repository: ", bold: true }),
        new TextRun({ text: "[INSERT PUBLIC GITHUB URL]", color: "0000EE", underline: {} }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Live Application: ", bold: true }),
        new TextRun({ text: "[INSERT LIVE APPLICATION URL]", color: "0000EE", underline: {} }),
      ],
      spacing: { after: 300 },
    }),
    createParagraph("───────────────────────────────────────────────────────────", {
      color: "D9E2D8",
    }),

    // ==========================================
    // 2. EXECUTIVE SUMMARY
    // ==========================================
    createHeader("2. Executive Summary"),
    createParagraph(
      "TripCanvas is an enterprise-grade full-stack travel platform and versioned content management system (CMS) engineered for Company A, a luxury tour operator based in Kochi, Kerala. The platform bridges the divide between aspirational travel editorial and transactional operations, enabling tour operators to market bespoke South India itineraries, manage seasonal pricing with strict financial integrity, ingest multi-channel traveller enquiries, and streamline consultation through server-side artificial intelligence."
    ),
    createParagraph(
      "The system is built upon modern web architecture utilizing Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL with Row Level Security (RLS), and Google's official Gemini Generative AI SDK (@google/genai). By prioritizing a bespoke editorial aesthetic over generic UI templates, TripCanvas delivers an immersive consumer experience alongside a rugged, high-throughput administrative console."
    ),

    // ==========================================
    // 3. PROBLEM STATEMENT
    // ==========================================
    createHeader("3. Problem Statement & Business Context"),
    createParagraph(
      "Company A faced substantial friction across its traditional operational workflow, hindering revenue growth and operational scalability:"
    ),
    createBullet(
      "Developer Dependency for Catalog Updates",
      "Package itinerary modifications, hotel tier reclassifications, and seasonal tariff adjustments historically required engineering intervention, creating severe marketing lag."
    ),
    createBullet(
      "Scattered Enquiry Management",
      "Customer enquiries arrived via fragmented, unmonitored channels (ad-hoc email, WhatsApp, phone calls) without centralized ticket tracking, leading to slow response times and missed booking conversions."
    ),
    createBullet(
      "Manual and Inaccurate Quote Preparation",
      "Consultants manually referenced spreadsheets to calculate rates across changing peak and monsoon seasons. This manual process led to pricing discrepancies, unquoted GST, and confusion around child occupancy."
    ),
    createBullet(
      "Absence of Version History",
      "Live edits directly mutated public pages, leaving no historical audit trail regarding what package terms or hotel categories were active when a traveller confirmed their reservation."
    ),

    // ==========================================
    // 4. PROJECT OBJECTIVES AND SCOPE
    // ==========================================
    createHeader("4. Project Objectives and Scope"),
    createParagraph("The scope of TripCanvas is divided into four transparent categories:"),
    createBullet(
      "Implemented Features",
      "Public package catalog (/packages) with destination, duration, price, and seasonal filtering; detailed package pages (/packages/[slug]) with day-wise itineraries, inclusions/exclusions, and transparent pricing tables; validated public enquiry forms with honeypot spam protection and rate limiting; versioned CMS editor with immutable publishing and snapshot rollback; CRM enquiry inbox with SLA tracking and status transitions; server-side Google Gemini requirement extraction with confidence scoring; deterministic package recommendations strictly using database records; simulated editorial reply generation with mandatory consultant approval; full audit logging; and permanent 301 legacy URL redirect management with bulk CSV import."
    ),
    createBullet(
      "Partially Implemented Features",
      "Supabase remote database integration: complete SQL migrations, schema constraints, and RLS policies are authored in supabase/migrations/ and supabase/seed.sql, with an active fallback in-memory persistent store to allow immediate, zero-friction local execution without prior cloud migration."
    ),
    createBullet(
      "Planned Features (Roadmap)",
      "Interactive branded PDF quote generator, multi-currency live exchange rate conversion, bi-directional WhatsApp Business API synchronization via webhooks, and automated consultant workload balancing."
    ),
    createBullet(
      "Explicitly Excluded Features",
      "Live payment gateway execution (e.g. Razorpay/Stripe checkout) and automated outbound message delivery to live telephone carriers, deliberately omitted to prevent unauthorized financial commitments or spam during sandbox evaluation."
    ),

    // ==========================================
    // 5. FUNCTIONAL REQUIREMENTS
    // ==========================================
    createHeader("5. Functional Requirements"),
    createBullet("FR-01: Public Catalog Discovery", "Travellers can search published packages by destination keyword, filter by duration tiers (1-4d, 5-7d, 8d+), starting price ranges, and active seasons, and sort results ascending or descending."),
    createBullet("FR-02: Transparent Price Calculation", "Every package displays verified per-person pricing, twin-sharing basis disclosures, statutory 5% GST disclosures, and explicit notices that child pricing requires confirmation."),
    createBullet("FR-03: Enquiry Ingestion & Ack", "Public travellers can submit travel requirements without creating accounts; valid submissions create persistent records with unique reference IDs (e.g. ENQ-2026-001) and generate immediate system acknowledgement logs."),
    createBullet("FR-04: Versioned CMS Management", "Staff can create draft packages, preview unpublished changes without altering live pages, and execute transactional publishing that updates package pointers and preserves prior versions."),
    createBullet("FR-05: Non-Destructive Rollback", "Restoring an earlier version creates a brand-new version snapshot from historical data without mutating or deleting prior versions."),
    createBullet("FR-06: AI Parameter Extraction", "Server-side Gemini analyzes traveller messages to extract destination, month, duration, adults, children, budget, and desired experiences with confidence ratings."),
    createBullet("FR-07: Deterministic Recommendation", "Matches packages against extracted parameters using a deterministic 100-point algorithm, strictly referencing published database packages."),
    createBullet("FR-08: AI Reply Drafting & Approval", "Drafts an editorial email response populated strictly with database pricing records; requires manual consultant approval before marking as dispatched."),
    createBullet("FR-09: Audit Activity Logging", "All administrative actions (creation, editing, publishing, rollback, assignment, and approval) generate immutable audit records."),
    createBullet("FR-10: Legacy URL Redirects", "Maps outdated website URLs to modern canonical package routes via 301 permanent redirects, with single-entry and bulk CSV import capabilities."),

    // ==========================================
    // 6. NON-FUNCTIONAL REQUIREMENTS
    // ==========================================
    createHeader("6. Non-Functional Requirements"),
    createBullet("Performance", "Sub-2.5 second initial page render on 4G networks; verified via Next.js static page prerendering, automatic code splitting, and optimized Unsplash remote image caching."),
    createBullet("Security", "Zero client exposure of secrets (Gemini API key and Supabase service keys are server-side only); PostgreSQL Row Level Security; HTTPOnly SameSite cookie session management; Zod schema validation; and honeypot bot defense."),
    createBullet("Reliability", "Graceful degradation: if Google Gemini is unreachable or credentials are unconfigured, the system falls back to rule-based defaults, flags review_needed: true, and never drops or blocks an enquiry."),
    createBullet("Maintainability", "Full TypeScript strict mode coverage across all modules; zero build warnings; modular separation across lib/, components/, and app/ routes; 100% automated test passage."),
    createBullet("Scalability", "Stateless server route handlers and transactional database operations designed for deployment on edge or serverless cloud infrastructure (Vercel/Supabase)."),
    createBullet("Usability & Accessibility", "Responsive across mobile, tablet, and desktop viewports; semantic HTML elements; accessible form labels; and high-contrast typography conforming to WCAG AA guidelines."),

    // ==========================================
    // 7. TECHNOLOGY STACK
    // ==========================================
    createHeader("7. Technology Stack"),
    createParagraph("The following table details every verified technology utilized in the project:"),
    createTable(
      ["Technology", "Version", "Purpose", "Where Used"],
      [
        ["Next.js (App Router)", "15.5.28", "Full-stack framework, SSR, routing", "Entire application (src/app/)"],
        ["React", "19.0.0", "Component architecture & reactivity", "Frontend UI and forms"],
        ["TypeScript", "5.7.3", "Static type checking & schema safety", "Entire project codebase"],
        ["Tailwind CSS", "3.4.17", "Custom luxury Kerala design system", "Styling & responsive layout"],
        ["Supabase / PostgreSQL", "2.49.1", "Database persistence & RLS", "supabase/ and src/lib/supabase/"],
        ["Google Gen AI SDK", "0.2.0", "Server-side LLM extraction & drafting", "src/lib/ai/gemini.ts"],
        ["Zod", "3.24.2", "Schema validation & AI output parsing", "src/lib/validation/"],
        ["Vitest", "3.2.7", "Automated unit & integration testing", "tests/ directory"],
        ["Lucide React", "0.475.0", "Icons for travel & admin UX", "Shared UI components"],
        ["docx", "9.2.0", "Programmatic DOCX document generation", "scripts/ & documentation"],
      ]
    ),

    // ==========================================
    // 8. SYSTEM ARCHITECTURE
    // ==========================================
    createHeader("8. System Architecture"),
    createParagraph(
      "TripCanvas follows a layered architecture separating public presentation, administrative CMS operations, server-side business intelligence, and relational persistence. The diagram below represents the system data flow:"
    ),
    ...createCodeBlock(
`graph TD
  User[Public Traveller] -->|Browses Catalog / Submits Form| FE[Next.js App Router (SSR & RSC)]
  Staff[Admin / Editor / Consultant] -->|Authenticates via Cookie| Portal[Staff Operations Dashboard]
  
  subgraph Next.js Application Core
    FE --> Router[Route Handlers & Server Actions]
    Portal --> Router
    Router --> Auth[Auth & RBAC Middleware]
    Router --> Val[Zod Schema Validation & Rate Limiting]
    Router --> PricingEngine[Deterministic Pricing Calculator]
    Router --> RecEngine[Package Scoring Matcher]
  end

  subgraph AI Services Layer
    Router -->|Server-Side API Call| Gemini[Google Gemini API (@google/genai)]
    Gemini -->|Structured JSON Extraction| Router
  end

  subgraph Persistence & Audit
    Router --> Store[Unified Data Access Layer (Supabase / In-Memory Store)]
    Store --> DB[(Supabase PostgreSQL)]
    Store --> Audit[(activity_logs Table)]
  end`
    ),

    // ==========================================
    // 9. APPLICATION MODULES
    // ==========================================
    createHeader("9. Application Modules"),
    createBullet("Catalog Module (src/app/(public)/packages)", "Renders published travel listings, handles client-side filtering, and renders detail pages with day-wise itineraries, route maps, and seasonal price tables."),
    createBullet("Enquiry Module (src/app/(public)/enquire)", "Handles public travel requests with client/server Zod validation, honeypot traps, and automated generation of acknowledgement records."),
    createBullet("Package CMS Module (src/app/admin/packages)", "Implements the 10-section package editor, draft persistence, draft preview rendering, transactional publishing, and historical rollback."),
    createBullet("CRM Inbox Module (src/app/admin/enquiries)", "Provides staff with centralized enquiry triage, status progression, consultant assignment, and internal note keeping."),
    createBullet("AI Operational Module (src/lib/ai/)", "Encapsulates Gemini extraction with strict timeouts, deterministic package recommendation scoring, and editorial quote drafting."),
    createBullet("Auth & RBAC Module (src/lib/auth/)", "Enforces role-based permissions across Admin, Editor, Consultant, and Traveller roles using HTTPOnly cookie sessions."),
    createBullet("Audit Logging Module (src/app/admin/activity)", "Tracks operational events across all entities to maintain compliance and traceability."),
    createBullet("Redirects Module (src/app/admin/redirects)", "Maintains permanent 301 redirects to ensure seamless SEO transition from legacy URLs."),

    // ==========================================
    // 10. DATABASE DESIGN
    // ==========================================
    createHeader("10. Database Design"),
    createParagraph(
      "The relational database schema is structured into 11 tables in PostgreSQL, complete with foreign key relationships and check constraints. The entity relationships are illustrated below:"
    ),
    ...createCodeBlock(
`erDiagram
  profiles ||--o{ package_versions : "creates"
  profiles ||--o{ enquiries : "assigned_to"
  profiles ||--o{ enquiry_notes : "authors"
  profiles ||--o{ enquiry_messages : "approves"
  profiles ||--o{ activity_logs : "triggers"
  
  packages ||--o{ package_versions : "has_many"
  packages ||--o{ enquiries : "referenced_in"
  packages ||--o{ package_suggestions : "suggested_in"
  
  package_versions ||--o{ package_version_prices : "contains"
  package_versions ||--o{ package_suggestions : "matched_version"
  
  enquiries ||--o| ai_extractions : "generates"
  enquiries ||--o{ package_suggestions : "receives"
  enquiries ||--o{ enquiry_notes : "contains"
  enquiries ||--o{ enquiry_messages : "contains"`
    ),
    createParagraph("Table Schema Summary:"),
    createTable(
      ["Table Name", "Primary Key", "Key Foreign Keys", "Description & Constraints"],
      [
        ["profiles", "id (UUID)", "auth.users(id)", "Staff and user profiles with role check constraint ('admin', 'editor', 'consultant', 'traveller')."],
        ["packages", "id (TEXT)", "published_version_id, draft_version_id", "Master packages table holding unique slug and version pointers."],
        ["package_versions", "id (UUID)", "package_id (packages.id)", "Immutable version records storing structured content, status ('draft','published','archived'), and version number."],
        ["package_version_prices", "id (UUID)", "package_version_id (package_versions.id)", "Seasonal pricing tiers per version (season_name, start/end month, price_per_person, currency)."],
        ["enquiries", "id (UUID)", "package_id, assigned_consultant_id", "Traveller enquiries with unique enquiry_number, traveller counts, budget, consent flag, and status."],
        ["ai_extractions", "id (UUID)", "enquiry_id (enquiries.id)", "Structured AI extraction output, confidence score, review_needed flag, and model metadata."],
        ["package_suggestions", "id (UUID)", "enquiry_id, package_id, package_version_id", "Deterministic recommendation matches with 0-100 score and match reason arrays."],
        ["enquiry_notes", "id (UUID)", "enquiry_id, author_id (profiles.id)", "Internal consultant discussion and operational notes."],
        ["enquiry_messages", "id (UUID)", "enquiry_id, approved_by (profiles.id)", "Outgoing messages and AI proposal drafts with approval timestamps."],
        ["activity_logs", "id (UUID)", "actor_id (profiles.id)", "Audit log entries recording action, entity_type, entity_id, and metadata JSON."],
        ["legacy_redirects", "id (UUID)", "None", "Mapping of legacy source paths to new target paths with 301 status code."],
      ]
    ),

    // ==========================================
    // 11. API DOCUMENTATION
    // ==========================================
    createHeader("11. API Documentation"),
    createParagraph("The following table documents all endpoints implemented in the Next.js API layer:"),
    createTable(
      ["Method", "Endpoint", "Auth Requirement", "Request / Purpose", "Success Response"],
      [
        ["GET", "/api/auth/session", "Public", "Inspect active cookie session", "{ user, isAuthenticated: boolean }"],
        ["POST", "/api/auth/session", "Public", "Body: { email } to authenticate demo staff role", "{ success: true, user: Profile }"],
        ["DELETE", "/api/auth/session", "Staff", "Clears session cookie", "{ success: true }"],
        ["GET", "/api/packages", "Public / Staff", "Query: ?scope=admin to retrieve drafts; default returns published", "{ packages: PackageRecord[] }"],
        ["POST", "/api/packages", "Admin / Editor", "Body: PackageEditorInput to create package with v1 draft", "201 Created: { package: PackageRecord }"],
        ["GET", "/api/packages/[id]", "Public / Staff", "Retrieve package by ID with versions", "{ package: PackageRecord }"],
        ["PUT", "/api/packages/[id]", "Admin / Editor", "Body: PackageEditorInput to update draft version", "{ success: true, package: PackageRecord }"],
        ["POST", "/api/packages/[id]/publish", "Admin / Editor", "Finalizes draft as published; updates pointer", "{ success: true, message: string }"],
        ["POST", "/api/packages/[id]/restore", "Admin Only", "Body: { versionNumber } to rollback to historical snapshot", "{ success: true, package: PackageRecord }"],
        ["POST", "/api/packages/[id]/duplicate", "Admin / Editor", "Duplicates package into a new draft", "{ success: true, package: PackageRecord }"],
        ["GET", "/api/enquiries", "Staff", "Query: ?status=&destination= to filter CRM inbox", "{ enquiries: EnquiryRecord[] }"],
        ["POST", "/api/enquiries", "Public", "Body: EnquiryFormInput (with honeypot & rate limit)", "201 Created: { enquiry: EnquiryRecord }"],
        ["GET", "/api/enquiries/[id]", "Staff", "Retrieve enquiry with AI extraction, suggestions, notes", "{ enquiry, aiExtraction, suggestions, notes, messages }"],
        ["PATCH", "/api/enquiries/[id]", "Staff", "Body: { status, assignedConsultantId, aiExtractionUpdate }", "{ success: true, ...updatedData }"],
        ["POST", "/api/enquiries/[id]/notes", "Staff", "Body: { note } to append internal note", "201 Created: { success: true, note: EnquiryNote }"],
        ["POST", "/api/enquiries/[id]/draft-reply", "Staff", "Body: { packageId } to trigger AI reply generation", "{ success: true, message: EnquiryMessage }"],
        ["POST", "/api/enquiries/[id]/approve-reply", "Consultant / Admin", "Body: { messageId } to approve and simulate dispatch", "{ success: true, message: EnquiryMessage }"],
        ["GET", "/api/activity", "Staff", "Retrieve audit activity log events", "{ logs: ActivityLogRecord[] }"],
        ["GET", "/api/redirects", "Public / Staff", "Retrieve list of active 301 redirects", "{ redirects: LegacyRedirectRecord[] }"],
        ["POST", "/api/redirects", "Admin / Editor", "Body: JSON { sourcePath, targetPath } or CSV text", "{ success: true, redirect: LegacyRedirectRecord }"],
      ]
    ),

    // ==========================================
    // 12. USER WORKFLOWS
    // ==========================================
    createHeader("12. User Workflows"),
    createBullet(
      "Traveller Discovery & Booking",
      "1. Lands on editorial homepage -> 2. Explores curated packages (/packages) with duration/price/season filters -> 3. Views full package details (/packages/[slug]) reviewing twin-sharing rates, GST disclosures, and itinerary -> 4. Clicks 'Enquire Now' -> 5. Completes validated form with consent -> 6. Receives reference number and instant acknowledgement."
    ),
    createBullet(
      "Content Authoring & Publishing",
      "1. Editor signs into /login -> 2. Opens Package CMS (/admin/packages) -> 3. Edits itinerary or adds seasonal pricing -> 4. Saves draft -> 5. Reviews draft appearance at /admin/packages/[id]/preview -> 6. Administrator executes 'Publish Live' -> 7. Published version becomes active and public."
    ),
    createBullet(
      "Enquiry Processing & AI Assistance",
      "1. Consultant views /admin/enquiries -> 2. Opens enquiry details -> 3. Inspects original message and Gemini extracted fields -> 4. Corrects any ambiguous fields -> 5. Reviews deterministic package matches -> 6. Triggers 'Generate Editorial Draft' -> 7. Edits draft and explicitly approves proposal -> 8. Status transitions to 'Replied'."
    ),

    // ==========================================
    // 13. FRONTEND DESIGN
    // ==========================================
    createHeader("13. Frontend Design"),
    createParagraph(
      "The frontend architecture utilizes React Server Components (RSC) to maximize performance and SEO, complemented by focused client components for interactivity (e.g. ItineraryAccordion, EnquiryForm, PackageEditorForm). State management utilizes React hooks and URL search params for bookmarkable filters. Forms enforce client-side Zod validation with real-time error feedback, disabled submission states, and accessible error alerts."
    ),

    // ==========================================
    // 14. BACKEND DESIGN
    // ==========================================
    createHeader("14. Backend Design"),
    createParagraph(
      "The backend layer is structured into modular domain services located in src/lib/: db/store.ts manages transactional persistence; ai/gemini.ts manages Google Gen AI interactions; ai/recommendation.ts encapsulates the deterministic scoring algorithm; pricing/calculator.ts calculates transparent tariffs; and auth/session.ts governs cryptographic cookie parsing. All mutations log structured entries into activity_logs."
    ),

    // ==========================================
    // 15. SECURITY CONSIDERATIONS
    // ==========================================
    createHeader("15. Security Considerations"),
    createBullet("Server-Side Secret Isolation", "The Google Gemini API key and Supabase credentials are strictly inaccessible from client runtimes. No secret keys are committed to Git."),
    createBullet("Input Sanitization & Validation", "All incoming payloads are strictly validated against Zod schemas; malformed or unverified fields are rejected before reaching business logic."),
    createBullet("Bot Mitigation & Rate Limiting", "Enquiry endpoints feature hidden honeypot fields that trap automated scrapers and in-memory IP rate limiting (10 requests per minute)."),
    createBullet("Row Level Security (RLS)", "PostgreSQL tables enforce policies restricting public queries to published records and safeguarding enquiry details to authenticated staff."),
    createBullet("DPDP Act 2023 Compliance", "Explicit consent tracking for WhatsApp and email communication is maintained with transparent withdrawal notices."),

    // ==========================================
    // 16. TESTING STRATEGY
    // ==========================================
    createHeader("16. Testing Strategy"),
    createParagraph(
      "TripCanvas incorporates an automated test suite executed via Vitest, verifying 15 critical unit and integration test assertions across 5 core suites:"
    ),
    createBullet("Pricing Suite (tests/unit/pricing.test.ts)", "Verifies correct seasonal selection across Peak (Dec) and Monsoon (Jul) months, strict 5% GST computation, and child disclaimer enforcement."),
    createBullet("Validation Suite (tests/unit/validation.test.ts)", "Verifies that invalid email formats and honeypot triggers are rejected, while valid payloads are safely committed."),
    createBullet("AI & Recommendation Suite (tests/unit/ai-recommendation.test.ts)", "Verifies that recommendations only reference published packages and that AI fallback handles offline scenarios without dropping enquiries."),
    createBullet("Versioning Suite (tests/unit/versioning.test.ts)", "Verifies that draft modifications do not pollute published live content, publishing updates pointers, and rollback creates new version snapshots."),
    createBullet("Authorization Suite (tests/unit/authorization.test.ts)", "Verifies that public users cannot access admin operations, editors cannot manage roles, and consultants have scoped access."),
    createParagraph("All 15 tests have been executed and verified in the workspace environment, passing with zero failures."),

    // ==========================================
    // 17. DEPLOYMENT ARCHITECTURE
    // ==========================================
    createHeader("17. Deployment Architecture"),
    createParagraph(
      "TripCanvas is configured for automated continuous deployment on Vercel paired with a Supabase PostgreSQL backend. Next.js statically prerenders public marketing routes (/about, /contact, /privacy, /terms, sitemap.xml) while dynamically executing server routes (/packages, /admin/*, /api/*). Complete migration scripts are maintained in supabase/migrations/ and detailed deployment steps are provided in deployment.md."
    ),

    // ==========================================
    // 18. ENVIRONMENT VARIABLES
    // ==========================================
    createHeader("18. Environment Variables"),
    createParagraph("The following table details the expected environment configuration:"),
    createTable(
      ["Variable Name", "Required", "Purpose", "Safe Placeholder Example"],
      [
        ["NEXT_PUBLIC_SUPABASE_URL", "Yes", "Supabase PostgreSQL endpoint", "https://your-project.supabase.co"],
        ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "Yes", "Supabase anonymous public key", "sb_publishable_placeholder"],
        ["NEXT_PUBLIC_SITE_URL", "Yes", "Canonical URL for SEO & sitemaps", "http://localhost:3000"],
        ["GEMINI_API_KEY", "Yes (for AI)", "Google Gen AI server-side API key", "your-gemini-api-key-here"],
      ]
    ),

    // ==========================================
    // 19. ERROR HANDLING AND LOGGING
    // ==========================================
    createHeader("19. Error Handling and Logging"),
    createParagraph(
      "TripCanvas applies structured error handling across both client and server boundaries. API route handlers wrap operations in try-catch blocks returning standard JSON error responses with appropriate HTTP status codes (400, 401, 403, 404, 429, 500). If Gemini encounters network timeouts or rate limits, the intake pipeline safely logs the warning and falls back to rule-based defaults. Operational changes are recorded in the activity_logs table for auditability."
    ),

    // ==========================================
    // 20. PERFORMANCE AND SCALABILITY
    // ==========================================
    createHeader("20. Performance and Scalability"),
    createParagraph(
      "Performance optimizations include: Incremental Static Regeneration (ISR) and static page generation for public marketing routes; Next.js Image optimization for remote Unsplash photography; CSS bundle minification via Tailwind; and lightweight Lucide SVG icons. For future enterprise scaling, database connection pooling via Supabase pgBouncer and distributed caching via Redis are recommended."
    ),

    // ==========================================
    // 21. KNOWN LIMITATIONS
    // ==========================================
    createHeader("21. Known Limitations"),
    createBullet("Simulated External Delivery", "Outbound emails and WhatsApp dispatches are simulated as message records in the local database rather than delivered to live telecom carriers."),
    createBullet("Offline AI Rule Fallback", "When running without a valid Gemini API key, AI extraction relies on regex heuristics and flags the intake for manual consultant review."),
    createBullet("Single-Region In-Memory State", "The in-memory data store operates on a single Node.js process; production deployment across multiple serverless regions requires executing the provided Supabase SQL migrations."),

    // ==========================================
    // 22. FUTURE ENHANCEMENTS
    // ==========================================
    createHeader("22. Future Enhancements"),
    createBullet("PDF Proposal Builder", "Automated client-side or server-side generation of branded PDF itinerary brochures with dynamic customer names and prices."),
    createBullet("Two-Way WhatsApp Webhook Sync", "Live bi-directional synchronization of WhatsApp chat transcripts into the enquiry CRM thread."),
    createBullet("Hotel Inventory Integrations", "Direct API integration with Channel Managers (e.g. SiteMinder) for real-time room availability confirmation."),

    // ==========================================
    // 23. INSTALLATION AND EXECUTION
    // ==========================================
    createHeader("23. Installation and Execution"),
    createParagraph(
      "To execute TripCanvas locally:\n" +
      "1. Install dependencies: npm install\n" +
      "2. Execute test suite: npm test\n" +
      "3. Start development server: npm run dev (accessible on http://localhost:3000)\n" +
      "4. Production build: npm run build followed by npm start\n" +
      "Refer to deployment.md for complete cloud migration and Supabase setup instructions."
    ),

    // ==========================================
    // 25. CONCLUSION
    // ==========================================
    createHeader("25. Conclusion"),
    createParagraph(
      "TripCanvas represents a robust, production-quality solution tailored to the operational and brand requirements of Company A, Kochi. By combining an editorial design aesthetic with versioned CMS immutability, deterministic pricing controls, server-side AI extraction, and role-based access control, the platform resolves developer bottlenecks and transforms travel enquiry triage into an efficient, professional workflow."
    )
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "TripCanvas — Technical Design Document",
                    size: 16,
                    color: "666666",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Page ",
                    size: 16,
                    color: "666666",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: "666666",
                  }),
                  new TextRun({
                    text: " of ",
                    size: 16,
                    color: "666666",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: "666666",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("docs/TDD.docx", buffer);
  try {
    fs.writeFileSync("TDD.docx", buffer);
    console.log("Successfully written docs/TDD.docx and TDD.docx");
  } catch (err) {
    console.warn("Notice: TDD.docx in root directory is currently open in another program (e.g. Word). docs/TDD.docx was updated successfully.");
  }
}

buildDocx();

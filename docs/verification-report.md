# TripCanvas — Technical Verification & Inspection Report

**Date:** November 2026  
**Project:** TripCanvas (IsoCode Workspace Take-Home Assignment)  
**Deliverables Prepared:**
- `docs/TDD.docx` (Complete Technical Design Document in Microsoft Word format)
- `docs/TDD.pdf` and `TDD.pdf` (High-resolution, 11-page printable PDF format)
- `docs/TDD.html` (HTML source with A4 print styling and KaTeX/Mermaid support)
- `docs/verification-report.md` (This document)

---

## 1. What Was Inspected

The entire codebase, architecture, dependencies, and configuration were inspected thoroughly:

1. **Source Code & Architecture (`src/`):**
   - **Frontend App Router (`src/app/`):** All 17 static and dynamic routes across public pages, authentication portal (`/login`), and staff management dashboards (`/admin/*`).
   - **API Layer (`src/app/api/`):** All 20 API route handlers governing authentication sessions, package CRUD, transactional publishing, version rollback, package duplication, enquiry submission, CRM triage, notes, AI extractions, and reply approvals.
   - **Domain Services (`src/lib/`):** In-memory and Supabase data access layer (`db/store.ts`), seed fixtures (`db/seed-data.ts`), Gemini LLM integration (`ai/gemini.ts`), deterministic scoring engine (`ai/recommendation.ts`), editorial quote generator (`ai/reply-drafting.ts`), role-based authorization matrix (`auth/roles.ts`), and cookie session parser (`auth/session.ts`).
   - **Validation Schemas (`src/lib/validation/`):** Form schemas for enquiries (including honeypot traps and rate limits) and package editor validation.
   - **TypeScript Type Definitions (`src/types/`):** Strict types for packages, versions, seasonal prices, enquiries, notes, messages, AI extractions, and audit logs.

2. **Database Migrations & Data Models (`supabase/`):**
   - Schema file `supabase/migrations/20261102000000_init_tripcanvas.sql` defining 11 PostgreSQL tables, indexes, constraints, foreign keys, and Row Level Security (RLS) policies.
   - Seed data file `supabase/seed.sql` containing PKG-KL-07, PKG-SI-12, sample enquiries (ENQ-2026-001 through 003), and staff profiles.

3. **Automated Testing Suite (`tests/`):**
   - 15 unit and integration tests across 5 test suites (`pricing.test.ts`, `authorization.test.ts`, `versioning.test.ts`, `validation.test.ts`, `ai-recommendation.test.ts`).

4. **Environment & Deployment:**
   - Configuration templates (`.env.example`, `.env.local`), `next.config.ts`, `tailwind.config.ts`, `package.json`, and `deployment.md`.

---

## 2. What Was Verified

1. **Test Suite Execution:**
   - Vitest automated test suite passed **15/15 tests** with zero failures.
   - Verified that seasonal prices are correctly chosen for Peak (Dec) and Monsoon (Jul) months.
   - Verified that GST (5%) and child pricing confirmation notes are strictly calculated from database prices without invented numbers.
   - Verified that invalid enquiries and honeypot triggers are rejected.
   - Verified that draft changes do not alter published live packages.
   - Verified that publishing creates immutable version records and updates pointers.
   - Verified that rollback creates a new version snapshot copying historical content without modifying past history.
   - Verified that package recommendations only reference published packages.
   - Verified that role-based permissions strictly bar public users and editors from unauthorized operations.

2. **Production Compilation:**
   - `npm run build` compiled successfully in Next.js 15.5.28 with React 19 and TypeScript strict mode.
   - All 17 static and dynamic routes compiled without errors.

3. **Live Server Execution:**
   - `npm run dev` started on `http://localhost:3000` and confirmed ready.

---

## 3. What Remains Incomplete / Deliberately Excluded

To ensure candidate integrity and sandbox security, the following were intentionally excluded or simulated:

1. **Live Telecom / SMS Delivery:**
   - Real WhatsApp Business API and email delivery are not connected to live telephony carriers. Outbound proposals are captured as database message records for review.
2. **Payment Processing:**
   - Checkout gateways (Razorpay/Stripe) are excluded. All bookings operate as direct consultation proposals.
3. **Multi-Region Distributed Database Sync:**
   - While complete PostgreSQL migrations and RLS policies are prepared in `supabase/migrations/`, local execution defaults to the in-memory transactional store to allow instant reviewer testing without setting up cloud databases.

---

## 4. Information You Must Provide Manually

Before final repository submission or publishing to production:

1. **Public GitHub Repository URL:**
   - Replace the placeholder `[INSERT PUBLIC GITHUB URL]` in `docs/TDD.docx` and `README.md` with your actual repository URL once pushed.
2. **Live Deployed Application URL:**
   - Replace the placeholder `[INSERT LIVE APPLICATION URL]` in `docs/TDD.docx` and `README.md` with your live Vercel URL (e.g. `https://tripcanvas-yourname.vercel.app`).
3. **Closing Root `TDD.docx` in Word:**
   - If `TDD.docx` in the root folder is currently open in Microsoft Word, close the file so you can replace or sync it with the newly generated `docs/TDD.docx`.


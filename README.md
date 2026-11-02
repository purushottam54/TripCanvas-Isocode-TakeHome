# TripCanvas — Luxury Kerala & South India Travel Platform

> **Client:** Company A, Kochi  
> **Assignment:** Take-home Project for Software Engineering Internship at IsoCode Labs  
> **Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL & Auth, Google Gemini API (`@google/genai`), Vitest.

---

## Overview

**TripCanvas** is a full-stack editorial travel platform and content management system developed for a boutique Kerala tour operator. It addresses critical business bottlenecks:
1. **Developer Dependency:** Package itineraries and seasonal rates can now be updated independently by editors and published transactionally by administrators.
2. **Immutable Versioning:** Published packages are strictly separated from drafts. Historical versions can be previewed or rolled back safely without mutating previous audit history.
3. **Scattered Enquiries:** All traveller submissions are ingested into a centralized CRM inbox with SLA deadline tracking.
4. **AI-Assisted Operations:** Server-side Google Gemini extracts structured travel preferences (dates, budget, group sizes, desired experiences) and drafts personalized editorial replies.
5. **Deterministic Pricing Integrity:** Prices are retrieved exclusively from published PostgreSQL pricing records. The AI is strictly prohibited from inventing discounts, child pricing, or package prices.

---

## Key Screens Implemented

1. **Public Package Listing (`/packages`):** Filter by destination, duration, price tier, and season; sort by price and duration; live database prices.
2. **Public Package Details (`/packages/[slug]`):** Cinematic hero photography, itinerary breakdown, hotel categories, inclusions/exclusions, twin-sharing basis, transparent 5% GST disclosure, illustrative route map, and direct enquiry booking.
3. **Public Enquiry Form (`/enquire` & `/enquire/[packageSlug]`):** Client & server Zod validation, honeypot spam protection, rate limiting, and instant acknowledgement record generation.
4. **Admin Package Management (`/admin/packages`):** Search, status filtering, package duplication, draft management, and version indicators.
5. **Versioned CMS Editor & Preview (`/admin/packages/[id]/edit` & `/preview`):** Organized 10-section editor, draft saving, live staff preview of unpublished drafts, publishing workflow, and version rollback.
6. **Admin Enquiry Inbox (`/admin/enquiries`):** CRM-style view with response deadline indicator, status changes (`new`, `assigned`, `in_progress`, `replied`, `closed`), and consultant assignment.
7. **Enquiry Detail & AI Assistant (`/admin/enquiries/[id]`):** Permanent customer message display, AI extracted fields with review confidence flags, consultant field corrections, deterministic package suggestions, and approval workflow for reply drafts.
8. **Activity & Audit Logs (`/admin/activity`):** Immutable log of package publishing, rollbacks, and enquiry status transitions.
9. **Legacy URL Redirects (`/admin/redirects`):** Permanent 301 redirection manager with bulk CSV import.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (15 unit/integration tests)
npm test

# 3. Run production build
npm run build

# 4. Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) for the public website.  
Visit [http://localhost:3000/login](http://localhost:3000/login) for the staff portal.

---

## Architecture & Submission Documents

- `TDD.docx`: Complete Technical Design Document.
- `deployment.md`: Detailed deployment, database migration, and operations guide.
- `supabase/migrations/`: Complete PostgreSQL schema with Row Level Security (RLS).
- `supabase/seed.sql`: Realistic seed data including PKG-KL-07, PKG-SI-12, and sample enquiries.

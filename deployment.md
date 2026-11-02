# TripCanvas — Deployment & Operations Guide

This guide provides instructions to configure, migrate, seed, and run the **TripCanvas** platform both locally and in production (e.g., Vercel + Supabase).

---

## 1. Prerequisites

- **Node.js**: v20+ LTS or v24+
- **Package Manager**: `npm` (v10+) or `pnpm` (v9+)
- **Git**: Installed and configured
- **Supabase Account**: Free or Pro tier project (PostgreSQL 15+)
- **Google AI Studio Account**: Gemini API key (for server-side extraction and reply drafting)

---

## 2. Environment Variables

Create a file named `.env.local` in the project root:

```bash
# Supabase PostgreSQL & Auth Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Canonical Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Gemini API Key (Server-side only — never exposed to client)
GEMINI_API_KEY=your-gemini-api-key-here
```

A template file `.env.example` is also provided in the repository.

> **Security Note:** Never commit `.env.local` or `.env` files containing live API keys to Git. Gemini and Supabase service credentials must remain server-side only.

---

## 3. Local Installation & Development

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL_PLACEHOLDER>
   cd TOUR
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Supabase Database Migration & RLS Setup

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project, navigate to **SQL Editor**, and create a new query.
3. Open `supabase/migrations/20261102000000_init_tripcanvas.sql` from this repository.
4. Copy and paste the entire script into the SQL Editor and click **Run**.
   - This creates:
     - `profiles`
     - `packages`
     - `package_versions`
     - `package_version_prices`
     - `enquiries`
     - `ai_extractions`
     - `package_suggestions`
     - `enquiry_notes`
     - `enquiry_messages`
     - `activity_logs`
     - `legacy_redirects`
   - Enables Row Level Security (RLS) on all tables.
   - Sets up read policies for published packages and staff policies for management.

---

## 5. Seeding Realistic Demo Data

1. In the Supabase SQL Editor, open `supabase/seed.sql`.
2. Execute the script to seed:
   - **PKG-KL-07**: Munnar, Thekkady and Alleppey Houseboat (Published with Peak ₹32,500 and Monsoon ₹24,900 seasonal prices).
   - **PKG-SI-12**: Madurai, Rameswaram and Kanyakumari (Draft v1 with All Year ₹18,750 pricing).
   - Additional curated Kerala packages (Wayanad, Fort Kochi).
   - Realistic test enquiries (`ENQ-2026-001`, `002`, `003`), AI extraction snapshots, and activity logs.
   - Initial staff accounts (`admin@tripcanvas.internal`, `editor@tripcanvas.internal`, `consultant@tripcanvas.internal`).

---

## 6. Admin & Staff Demo Authentication

TripCanvas includes a built-in staff authentication portal accessible at `/login`:

| Role | Email | Capabilities |
| :--- | :--- | :--- |
| **Admin** | `admin@tripcanvas.internal` | Full access: manage packages, publish live versions, rollback history, view enquiries, assign staff, audit logs. |
| **Editor** | `editor@tripcanvas.internal` | Content creation: edit packages, draft versions, manage itineraries and seasonal rates, preview drafts. |
| **Consultant** | `consultant@tripcanvas.internal` | CRM & quotes: view enquiries, review AI extractions, correct parameters, approve simulated reply drafts. |

---

## 7. Vercel Deployment Instructions

1. Push your code to your GitHub repository.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel deployment URL, e.g. `https://tripcanvas.vercel.app`)
   - `GEMINI_API_KEY`
4. Click **Deploy**. Vercel will run `npm run build` and launch the application.

---

## 8. Graceful Degradation & Offline AI Handling

- If `GEMINI_API_KEY` is omitted or invalid, the application will **not** crash.
- Enquiries are safely committed to PostgreSQL.
- The AI extraction service automatically flags the intake as `review_needed: true` with a fallback status, allowing the consultant to verify parameters manually.
- Package recommendations rely on a deterministic database scoring function, completely independent of external LLM availability.

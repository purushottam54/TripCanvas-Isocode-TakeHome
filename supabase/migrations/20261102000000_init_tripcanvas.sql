-- ====================================================================
-- TripCanvas Schema Migration
-- Complete PostgreSQL schema with RLS, constraints, and audit logging
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'consultant', 'traveller')) DEFAULT 'traveller',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY, -- e.g. 'PKG-KL-07'
  slug TEXT UNIQUE NOT NULL,
  published_version_id UUID,
  draft_version_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PACKAGE VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.package_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id TEXT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration_days INT NOT NULL CHECK (duration_days > 0),
  hotel_category TEXT NOT NULL,
  overview TEXT NOT NULL,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  route_map JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  price_basis TEXT NOT NULL DEFAULT 'per person on twin sharing basis',
  gst_disclosure TEXT NOT NULL DEFAULT '5% GST applicable additionally',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  CONSTRAINT uq_package_version UNIQUE (package_id, version_number)
);

-- Add foreign keys to packages for published and draft versions
ALTER TABLE public.packages 
  DROP CONSTRAINT IF EXISTS fk_packages_published_version,
  ADD CONSTRAINT fk_packages_published_version FOREIGN KEY (published_version_id) REFERENCES public.package_versions(id) ON DELETE SET NULL;

ALTER TABLE public.packages 
  DROP CONSTRAINT IF EXISTS fk_packages_draft_version,
  ADD CONSTRAINT fk_packages_draft_version FOREIGN KEY (draft_version_id) REFERENCES public.package_versions(id) ON DELETE SET NULL;

-- 4. PACKAGE VERSION PRICES TABLE
CREATE TABLE IF NOT EXISTS public.package_version_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_version_id UUID NOT NULL REFERENCES public.package_versions(id) ON DELETE CASCADE,
  season_name TEXT NOT NULL,
  start_month INT CHECK (start_month BETWEEN 1 AND 12),
  end_month INT CHECK (end_month BETWEEN 1 AND 12),
  price_per_person NUMERIC(10, 2) NOT NULL CHECK (price_per_person >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  child_price_notes TEXT NOT NULL DEFAULT 'Child pricing requires confirmation',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package_id TEXT REFERENCES public.packages(id) ON DELETE SET NULL,
  package_slug TEXT,
  destination TEXT NOT NULL,
  travel_start_date DATE,
  travel_duration TEXT,
  adults_count INT NOT NULL DEFAULT 2 CHECK (adults_count >= 1),
  children_count INT NOT NULL DEFAULT 0 CHECK (children_count >= 0),
  budget NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'INR',
  special_requirements TEXT,
  whatsapp_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('new', 'assigned', 'in_progress', 'replied', 'closed')) DEFAULT 'new',
  assigned_consultant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  response_deadline TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  channel TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. AI EXTRACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_extractions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  original_message TEXT NOT NULL,
  destination TEXT,
  arrival_date_or_month TEXT,
  duration TEXT,
  adults_count INT,
  children_count INT,
  budget NUMERIC(12, 2),
  currency TEXT DEFAULT 'INR',
  required_experiences JSONB DEFAULT '[]'::jsonb,
  special_requirements TEXT,
  extraction_status TEXT NOT NULL CHECK (extraction_status IN ('success', 'failed', 'corrected', 'pending')),
  review_needed BOOLEAN NOT NULL DEFAULT false,
  confidence_score NUMERIC(3, 2),
  model_info TEXT,
  raw_model_output TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PACKAGE SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.package_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  package_version_id UUID REFERENCES public.package_versions(id) ON DELETE SET NULL,
  score NUMERIC(5, 2) NOT NULL,
  match_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ENQUIRY NOTES TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. ENQUIRY MESSAGES TABLE (Reply Drafting & Simulated Sending)
CREATE TABLE IF NOT EXISTS public.enquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_ai_draft BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  sent_simulated_at TIMESTAMPTZ,
  channel TEXT NOT NULL DEFAULT 'email',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. LEGACY REDIRECTS TABLE
CREATE TABLE IF NOT EXISTS public.legacy_redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  status_code INT NOT NULL DEFAULT 301,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
CREATE INDEX IF NOT EXISTS idx_package_versions_package_id ON public.package_versions(package_id);
CREATE INDEX IF NOT EXISTS idx_package_versions_status ON public.package_versions(status);
CREATE INDEX IF NOT EXISTS idx_package_version_prices_version ON public.package_version_prices(package_version_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_destination ON public.enquiries(destination);
CREATE INDEX IF NOT EXISTS idx_enquiries_consultant ON public.enquiries(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legacy_redirects_source ON public.legacy_redirects(source_path);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_version_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_redirects ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has a staff role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor', 'consultant')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view their own profile; staff can view all profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "Admin update profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Packages: Anyone can view published packages; staff can view/edit all
CREATE POLICY "Public view published packages" ON public.packages
  FOR SELECT USING (published_version_id IS NOT NULL);

CREATE POLICY "Staff manage packages" ON public.packages
  FOR ALL USING (public.is_staff());

-- Package Versions: Anyone can view published version; staff view all
CREATE POLICY "Public view published versions" ON public.package_versions
  FOR SELECT USING (status = 'published');

CREATE POLICY "Staff manage package versions" ON public.package_versions
  FOR ALL USING (public.is_staff());

-- Package Version Prices: Public view for published versions; staff view/edit all
CREATE POLICY "Public view published prices" ON public.package_version_prices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.package_versions pv
      WHERE pv.id = package_version_prices.package_version_id
      AND pv.status = 'published'
    )
  );

CREATE POLICY "Staff manage prices" ON public.package_version_prices
  FOR ALL USING (public.is_staff());

-- Enquiries: Public can insert; staff can read/update
CREATE POLICY "Public insert enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff view and manage enquiries" ON public.enquiries
  FOR ALL USING (public.is_staff());

-- AI Extractions: Staff only
CREATE POLICY "Staff manage ai_extractions" ON public.ai_extractions
  FOR ALL USING (public.is_staff());

-- Package Suggestions: Staff only
CREATE POLICY "Staff view package suggestions" ON public.package_suggestions
  FOR ALL USING (public.is_staff());

-- Enquiry Notes: Staff only
CREATE POLICY "Staff manage enquiry notes" ON public.enquiry_notes
  FOR ALL USING (public.is_staff());

-- Enquiry Messages: Staff only
CREATE POLICY "Staff manage messages" ON public.enquiry_messages
  FOR ALL USING (public.is_staff());

-- Activity Logs: Staff read-only; triggers or staff insert
CREATE POLICY "Staff view activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Staff insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_staff());

-- Legacy Redirects: Public can read
CREATE POLICY "Public read redirects" ON public.legacy_redirects
  FOR SELECT USING (true);


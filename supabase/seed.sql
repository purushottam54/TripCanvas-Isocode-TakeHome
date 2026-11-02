-- ====================================================================
-- TripCanvas Seed Data
-- Realistic sample packages, versions, pricing, enquiries, and demo users
-- ====================================================================

-- 1. SEED PROFILES
-- Demo Staff Accounts
INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@tripcanvas.internal', 'Kavitha Nair (Admin)', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'editor@tripcanvas.internal', 'Arjun Menon (Content Editor)', 'editor'),
  ('00000000-0000-0000-0000-000000000003', 'consultant@tripcanvas.internal', 'Deepa Kurian (Senior Tour Consultant)', 'consultant')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- 2. SEED PACKAGES
INSERT INTO public.packages (id, slug)
VALUES 
  ('PKG-KL-07', 'munnar-thekkady-alleppey-houseboat'),
  ('PKG-SI-12', 'madurai-rameswaram-kanyakumari'),
  ('PKG-KL-03', 'wayanad-rainforest-and-wildlife'),
  ('PKG-KL-05', 'kochi-heritage-and-marari-beach')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PACKAGE VERSIONS

-- PKG-KL-07 Version 1 (Published)
INSERT INTO public.package_versions (
  id,
  package_id,
  version_number,
  status,
  title,
  destination,
  duration_days,
  hotel_category,
  overview,
  itinerary,
  inclusions,
  exclusions,
  photos,
  route_map,
  seo_title,
  seo_description,
  price_basis,
  gst_disclosure,
  published_at
) VALUES (
  '11111111-1111-1111-1111-111111111101',
  'PKG-KL-07',
  1,
  'published',
  'Munnar, Thekkady and Alleppey Houseboat',
  'Kerala (Munnar, Thekkady, Alleppey)',
  6,
  '4 star',
  'An evocative 6-day voyage across the misty tea carpets of Munnar, spice sanctuaries of Thekkady, and the labyrinthine backwaters of Alleppey aboard a traditional private Kettuvallam houseboat.',
  '[
    {"day": 1, "title": "Cochin Arrival & Scenic Ascent to Munnar", "description": "Arrival at Cochin International Airport. Private transfer through lush rubber estates and Cheeyappara waterfalls to Munnar. Evening plantation walk.", "stay": "4-Star Hill Resort, Munnar"},
    {"day": 2, "title": "Munnar Tea Plantations & Eravikulam Sanctuary", "description": "Early morning visit to Eravikulam National Park, home of the endangered Nilgiri Tahr. Afternoon guided tour of the historic tea museum and Mattupetty lake.", "stay": "4-Star Hill Resort, Munnar"},
    {"day": 3, "title": "Munnar to Periyar Wildlife Sanctuary (Thekkady)", "description": "Scenic mountain descent to Thekkady. Afternoon boat safari on Lake Periyar with elephant sightings. Evening spice plantation sensory walk.", "stay": "4-Star Forest Lodge, Thekkady"},
    {"day": 4, "title": "Thekkady to Alleppey Private Houseboat Cruise", "description": "Drive to the serene backwaters of Alleppey. Board your luxury air-conditioned Kettuvallam. Drift past quiet palm-fringed canals with traditional Karimeen lunch served on board.", "stay": "Deluxe Private Houseboat, Alleppey"},
    {"day": 5, "title": "Alleppey Backwaters to Marari Coastal Solitude", "description": "Disembark after a sunrise breakfast on the water. Check into a beachfront eco-resort in Marari. Day free for seaside relaxation and Ayurvedic rejuvenation.", "stay": "Beachfront Eco-Resort, Marari"},
    {"day": 6, "title": "Departure from Cochin", "description": "After breakfast, private chauffeur transfer to Cochin International Airport for onward flight.", "stay": "Departure"}
  ]'::jsonb,
  '[
    "Private chauffeur-driven AC sedan for all transfers & sightseeing",
    "5 nights accommodation on twin-sharing basis in verified 4-star properties",
    "1 night exclusive deluxe private houseboat with all meals (Kerala cuisine)",
    "Daily buffet breakfast at all hotels and resorts",
    "Guided spice plantation tour in Thekkady",
    "All toll taxes, parking fees, driver allowance, and interstate permits"
  ]'::jsonb,
  '[
    "Airfare or train fares to and from Cochin",
    "Entry tickets to monuments, Eravikulam National Park safari, or cultural shows",
    "Personal expenses such as laundry, phone calls, beverages, and tips",
    "5% GST applicable on total invoice value",
    "Any optional excursions or water sports not mentioned in inclusions"
  ]'::jsonb,
  '[
    {"url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80", "caption": "Alleppey backwaters at golden dusk", "is_hero": true},
    {"url": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80", "caption": "Lush rolling tea terraces of Munnar", "is_hero": false},
    {"url": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80", "caption": "Traditional luxury houseboat cruise", "is_hero": false}
  ]'::jsonb,
  '[
    {"name": "Cochin Airport", "order": 1},
    {"name": "Munnar Hills", "order": 2},
    {"name": "Thekkady Spices", "order": 3},
    {"name": "Alleppey Backwaters", "order": 4},
    {"name": "Marari Beach", "order": 5},
    {"name": "Cochin Airport", "order": 6}
  ]'::jsonb,
  'Munnar, Thekkady & Alleppey Houseboat 6 Days Tour | TripCanvas',
  'Experience authentic Kerala on this 6-day curated holiday. Stay in luxury 4-star resorts and a private Alleppey houseboat. Per person transparent pricing.',
  'per person on twin sharing basis',
  '5% GST applicable additionally',
  now()
) ON CONFLICT (id) DO NOTHING;

-- PKG-SI-12 Version 1 (Draft)
INSERT INTO public.package_versions (
  id,
  package_id,
  version_number,
  status,
  title,
  destination,
  duration_days,
  hotel_category,
  overview,
  itinerary,
  inclusions,
  exclusions,
  photos,
  route_map,
  seo_title,
  seo_description,
  price_basis,
  gst_disclosure
) VALUES (
  '11111111-1111-1111-1111-111111111102',
  'PKG-SI-12',
  1,
  'draft',
  'Madurai, Rameswaram and Kanyakumari',
  'Tamil Nadu & South India',
  5,
  '3 star',
  'A sacred and historic pilgrimage trail through South India majestic Dravidian temples, the sea-spanning Pamban bridge at Rameswaram, and the confluence of three oceans at Cape Comorin.',
  '[
    {"day": 1, "title": "Madurai Heritage & Meenakshi Temple", "description": "Arrival in Madurai. Afternoon visit to the historic Meenakshi Amman Temple and Thirumalai Nayakkar Palace. Evening night ceremony at the temple.", "stay": "3-Star Hotel, Madurai"},
    {"day": 2, "title": "Madurai to Rameswaram via Pamban Bridge", "description": "Drive across the magnificent engineering marvel Pamban Bridge into Rameswaram island. Ramanathaswamy temple darshan and holy water theerthams.", "stay": "3-Star Hotel, Rameswaram"},
    {"day": 3, "title": "Dhanushkodi Exploration & Journey to Kanyakumari", "description": "Morning excursion to ghost town Dhanushkodi and Rama Setu viewpoint. Drive southwards towards Kanyakumari. Sunset view at the cape.", "stay": "3-Star Oceanfront Hotel, Kanyakumari"},
    {"day": 4, "title": "Kanyakumari Sunrise & Memorials", "description": "Witness sunrise over the confluence of Indian Ocean, Arabian Sea, and Bay of Bengal. Ferry to Vivekananda Rock Memorial and Thiruvalluvar Statue.", "stay": "3-Star Oceanfront Hotel, Kanyakumari"},
    {"day": 5, "title": "Departure via Trivandrum", "description": "Transfer to Trivandrum International Airport or Railway Station for onward journey.", "stay": "Departure"}
  ]'::jsonb,
  '[
    "Accommodation in 3-star certified heritage & boutique hotels",
    "Breakfast included on all days",
    "Private air-conditioned car for all transfers and temple tours",
    "All toll taxes, parking, and driver allowances"
  ]'::jsonb,
  '[
    "Temple special entry tickets or pooja fees",
    "Lunch and dinners unless specified",
    "Train or flight tickets",
    "5% GST applicable additionally"
  ]'::jsonb,
  '[
    {"url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80", "caption": "Historic South Indian temple architecture", "is_hero": true},
    {"url": "https://images.unsplash.com/photo-1621641147575-d918a514d4e0?auto=format&fit=crop&w=1200&q=80", "caption": "Vivekananda Rock Memorial in Kanyakumari", "is_hero": false}
  ]'::jsonb,
  '[
    {"name": "Madurai", "order": 1},
    {"name": "Rameswaram", "order": 2},
    {"name": "Dhanushkodi", "order": 3},
    {"name": "Kanyakumari", "order": 4},
    {"name": "Trivandrum", "order": 5}
  ]'::jsonb,
  'Madurai, Rameswaram & Kanyakumari 5 Days Tour | TripCanvas',
  'Explore the soul of South India across historic temples and coastlines.',
  'per person on twin sharing basis',
  '5% GST applicable additionally'
) ON CONFLICT (id) DO NOTHING;

-- Update package version pointers
UPDATE public.packages 
SET published_version_id = '11111111-1111-1111-1111-111111111101', draft_version_id = NULL 
WHERE id = 'PKG-KL-07';

UPDATE public.packages 
SET draft_version_id = '11111111-1111-1111-1111-111111111102', published_version_id = NULL 
WHERE id = 'PKG-SI-12';

-- 4. SEED SEASONAL PRICES
-- PKG-KL-07 Seasonal Prices
-- Peak: Oct - March: Rs 32,500
INSERT INTO public.package_version_prices (
  package_version_id,
  season_name,
  start_month,
  end_month,
  price_per_person,
  currency,
  child_price_notes,
  description
) VALUES 
(
  '11111111-1111-1111-1111-111111111101',
  'Peak Season (October–March)',
  10,
  3,
  32500.00,
  'INR',
  'Child pricing requires confirmation based on extra bed policy.',
  'Optimal pleasant weather across the high hills of Munnar and coastal backwaters.'
),
(
  '11111111-1111-1111-1111-111111111101',
  'Monsoon Renewal (June–September)',
  6,
  9,
  24900.00,
  'INR',
  'Child pricing requires confirmation based on extra bed policy.',
  'Lush green landscape, vibrant waterfalls, and tranquil rain-washed backwaters.'
);

-- PKG-SI-12 Seasonal Prices
-- All year: Rs 18,750
INSERT INTO public.package_version_prices (
  package_version_id,
  season_name,
  start_month,
  end_month,
  price_per_person,
  currency,
  child_price_notes,
  description
) VALUES 
(
  '11111111-1111-1111-1111-111111111102',
  'All Year Standard',
  1,
  12,
  18750.00,
  'INR',
  'Child pricing requires confirmation.',
  'Standard year-round pricing covering Madurai, Rameswaram, and Kanyakumari.'
);

-- 5. SEED REALISTIC ENQUIRIES
INSERT INTO public.enquiries (
  id,
  enquiry_number,
  full_name,
  email,
  phone,
  package_id,
  package_slug,
  destination,
  travel_start_date,
  travel_duration,
  adults_count,
  children_count,
  budget,
  currency,
  special_requirements,
  whatsapp_consent,
  status,
  assigned_consultant_id,
  channel,
  created_at
) VALUES 
(
  '22222222-2222-2222-2222-222222222201',
  'ENQ-2026-001',
  'Rohan Sharma',
  'rohan.sharma.demo@example.com',
  '+91 98765 43210',
  'PKG-KL-07',
  'munnar-thekkady-alleppey-houseboat',
  'Kerala',
  '2026-12-15',
  '5-6 nights',
  2,
  1,
  120000.00,
  'INR',
  'Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must.',
  true,
  'new',
  '00000000-0000-0000-0000-000000000003',
  'website',
  now() - interval '2 hours'
),
(
  '22222222-2222-2222-2222-222222222202',
  'ENQ-2026-002',
  'Ananya Iyer',
  'ananya.iyer.demo@example.com',
  '+91 98111 22334',
  NULL,
  NULL,
  'Tamil Nadu & South India',
  '2026-11-20',
  '4-5 days',
  2,
  0,
  45000.00,
  'INR',
  'Looking for a peaceful temple tour covering Rameswaram and Kanyakumari for elderly parents. Need comfortable sedan.',
  true,
  'assigned',
  '00000000-0000-0000-0000-000000000003',
  'website',
  now() - interval '5 hours'
),
(
  '22222222-2222-2222-2222-222222222203',
  'ENQ-2026-003',
  'David Richardson',
  'david.r.travel@example.com',
  '+44 7700 900123',
  'PKG-KL-07',
  'munnar-thekkady-alleppey-houseboat',
  'Kerala',
  '2027-01-10',
  '7 days',
  2,
  0,
  100000.00,
  'INR',
  'Interested in bird watching and Ayurvedic massage options alongside the houseboat stay.',
  false,
  'in_progress',
  '00000000-0000-0000-0000-000000000003',
  'website',
  now() - interval '18 hours'
) ON CONFLICT (id) DO NOTHING;

-- 6. SEED AI EXTRACTION FOR SAMPLE ENQUIRY 1
INSERT INTO public.ai_extractions (
  enquiry_id,
  original_message,
  destination,
  arrival_date_or_month,
  duration,
  adults_count,
  children_count,
  budget,
  currency,
  required_experiences,
  special_requirements,
  extraction_status,
  review_needed,
  confidence_score,
  model_info
) VALUES (
  '22222222-2222-2222-2222-222222222201',
  'Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must.',
  'Kerala',
  'December',
  '5-6 nights',
  2,
  1,
  120000.00,
  'INR',
  '["Houseboat", "Munnar Hills", "Backwaters"]'::jsonb,
  'Houseboat stay is essential. Extra bed required for 1 child.',
  'success',
  false,
  0.95,
  'gemini-3.8-flash'
) ON CONFLICT DO NOTHING;

-- 7. SEED PACKAGE SUGGESTION FOR ENQUIRY 1
INSERT INTO public.package_suggestions (
  enquiry_id,
  package_id,
  package_version_id,
  score,
  match_reasons
) VALUES (
  '22222222-2222-2222-2222-222222222201',
  'PKG-KL-07',
  '11111111-1111-1111-1111-111111111101',
  94.50,
  '[
    "Exact destination match (Kerala)",
    "Includes private Alleppey houseboat experience requested by customer",
    "Duration fits requested 5-6 nights",
    "Base adult cost (2 x ₹32,500 = ₹65,000) falls well within ₹1,20,000 total budget",
    "Child pricing requires consultant confirmation"
  ]'::jsonb
) ON CONFLICT DO NOTHING;

-- 8. SEED ACTIVITY LOGS
INSERT INTO public.activity_logs (
  actor_email,
  action,
  entity_type,
  entity_id,
  metadata
) VALUES 
('admin@tripcanvas.internal', 'package.published', 'package', 'PKG-KL-07', '{"version": 1, "title": "Munnar, Thekkady and Alleppey Houseboat"}'::jsonb),
('editor@tripcanvas.internal', 'package.created', 'package', 'PKG-SI-12', '{"version": 1, "title": "Madurai, Rameswaram and Kanyakumari", "status": "draft"}'::jsonb),
('system', 'enquiry.created', 'enquiry', 'ENQ-2026-001', '{"customer": "Rohan Sharma", "destination": "Kerala"}'::jsonb),
('admin@tripcanvas.internal', 'enquiry.assigned', 'enquiry', 'ENQ-2026-001', '{"assigned_to": "Deepa Kurian"}'::jsonb);

-- 9. SEED ILLUSTRATIVE LEGACY REDIRECTS
INSERT INTO public.legacy_redirects (source_path, target_path, status_code)
VALUES 
  ('/tours/kerala-houseboat-6days.html', '/packages/munnar-thekkady-alleppey-houseboat', 301),
  ('/packages/old-munnar-thekkady.php', '/packages/munnar-thekkady-alleppey-houseboat', 301),
  ('/destinations/south-india/rameswaram.html', '/packages/madurai-rameswaram-kanyakumari', 301)
ON CONFLICT (source_path) DO NOTHING;

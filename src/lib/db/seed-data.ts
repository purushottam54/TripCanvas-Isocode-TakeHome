import { PackageRecord, PackageVersion } from "@/types/package";
import { EnquiryRecord, EnquiryNote, EnquiryMessage } from "@/types/enquiry";
import { AiExtractionRecord, PackageSuggestionRecord } from "@/types/ai";
import { ActivityLogRecord, LegacyRedirectRecord } from "@/types/activity";
import { UserProfile } from "@/types/auth";

export const initialStaffProfiles: UserProfile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@tripcanvas.internal",
    fullName: "Kavitha Nair",
    role: "admin",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "editor@tripcanvas.internal",
    fullName: "Arjun Menon",
    role: "editor",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "consultant@tripcanvas.internal",
    fullName: "Deepa Kurian",
    role: "consultant",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

export const initialPackages: PackageRecord[] = [
  {
    id: "PKG-KL-07",
    slug: "munnar-thekkady-alleppey-houseboat",
    publishedVersionId: "ver-pkg-kl-07-v1",
    draftVersionId: null,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-15T12:00:00Z",
    publishedVersion: {
      id: "ver-pkg-kl-07-v1",
      packageId: "PKG-KL-07",
      versionNumber: 1,
      status: "published",
      title: "Munnar, Thekkady and Alleppey Houseboat",
      destination: "Kerala (Munnar, Thekkady, Alleppey)",
      durationDays: 6,
      hotelCategory: "4 star",
      overview:
        "An evocative 6-day voyage across the misty tea carpets of Munnar, spice sanctuaries of Thekkady, and the labyrinthine backwaters of Alleppey aboard a traditional private Kettuvallam houseboat.",
      itinerary: [
        {
          day: 1,
          title: "Cochin Arrival & Scenic Ascent to Munnar",
          description:
            "Private chauffeur pickup from Cochin International Airport. Travel through cascading waterfalls at Cheeyappara and Valara into the rolling misty tea hills of Munnar.",
          stay: "4-Star Hill Resort, Munnar",
          meals: "Dinner",
        },
        {
          day: 2,
          title: "Munnar Tea Estates & Eravikulam Sanctuary",
          description:
            "Early morning expedition to Eravikulam National Park to witness the endangered Nilgiri Tahr. Afternoon heritage tour of the Tata Tea Museum and Mattupetty Dam.",
          stay: "4-Star Hill Resort, Munnar",
          meals: "Breakfast, Dinner",
        },
        {
          day: 3,
          title: "Munnar to Periyar Spice Forest (Thekkady)",
          description:
            "Scenic drive through Cardamom Hills to Thekkady. Afternoon boat cruise on Lake Periyar for wild elephant and exotic bird sightings. Evening spice plantation sensory walk.",
          stay: "4-Star Forest Lodge, Thekkady",
          meals: "Breakfast, Dinner",
        },
        {
          day: 4,
          title: "Thekkady to Alleppey Private Houseboat Cruise",
          description:
            "Descent to the serene backwaters of Alleppey. Check into an authentic deluxe private air-conditioned houseboat (Kettuvallam). Slow navigation along palm-fringed lagoons with freshly prepared traditional Kerala meals.",
          stay: "Deluxe Private Houseboat, Alleppey",
          meals: "Breakfast, Lunch, Dinner",
        },
        {
          day: 5,
          title: "Alleppey Backwaters to Marari Seaside Solitude",
          description:
            "Sunrise breakfast amidst gentle water ripples. Disembark at 09:30 AM and transfer to a quiet beachfront eco-resort in Marari. Afternoon free for seaside relaxation or Ayurvedic rejuvenation.",
          stay: "Beachfront Eco-Resort, Marari",
          meals: "Breakfast",
        },
        {
          day: 6,
          title: "Departure via Cochin International Airport",
          description:
            "Breakfast by the Arabian Sea. Private chauffeur transfer to Cochin International Airport for your return flight.",
          stay: "Departure",
          meals: "Breakfast",
        },
      ],
      inclusions: [
        "Private chauffeur-driven AC sedan for all airport transfers & sightseeing",
        "5 nights luxury accommodation on twin-sharing basis in verified 4-star properties",
        "1 night exclusive deluxe private houseboat with all meals (Kerala cuisine)",
        "Daily buffet breakfast at all hotels and resorts",
        "Guided spice plantation tour in Thekkady",
        "All toll taxes, parking fees, driver allowance, and fuel surcharges",
      ],
      exclusions: [
        "Airfare or train fares to and from Cochin",
        "Entry tickets to monuments, Eravikulam National Park safari, or cultural shows",
        "Personal expenses such as laundry, telephone calls, alcoholic beverages, and tips",
        "5% GST applicable on total invoice value",
        "Optional excursions or water sports not explicitly mentioned in inclusions",
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
          caption: "Alleppey backwaters at golden dusk",
          isHero: true,
        },
        {
          url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
          caption: "Lush rolling tea terraces of Munnar",
          isHero: false,
        },
        {
          url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
          caption: "Traditional luxury houseboat cruise",
          isHero: false,
        },
      ],
      routeMap: [
        { name: "Cochin Airport", order: 1 },
        { name: "Munnar Hills", order: 2 },
        { name: "Thekkady Spices", order: 3 },
        { name: "Alleppey Backwaters", order: 4 },
        { name: "Marari Beach", order: 5 },
        { name: "Cochin Airport", order: 6 },
      ],
      seoTitle: "Munnar, Thekkady & Alleppey Houseboat 6 Days Tour | TripCanvas",
      seoDescription:
        "Experience authentic Kerala on this 6-day curated holiday. Stay in luxury 4-star resorts and a private Alleppey houseboat. Per person transparent pricing.",
      priceBasis: "per person on twin sharing basis",
      gstDisclosure: "5% GST applicable additionally",
      publishedAt: "2026-01-15T12:00:00Z",
      prices: [
        {
          id: "prc-kl07-peak",
          seasonName: "Peak Season (October–March)",
          startMonth: 10,
          endMonth: 3,
          pricePerPerson: 32500,
          currency: "INR",
          childPriceNotes:
            "Child pricing requires confirmation based on extra bed policy.",
          description:
            "Optimal pleasant weather across the high hills of Munnar and coastal backwaters.",
        },
        {
          id: "prc-kl07-monsoon",
          seasonName: "Monsoon Renewal (June–September)",
          startMonth: 6,
          endMonth: 9,
          pricePerPerson: 24900,
          currency: "INR",
          childPriceNotes:
            "Child pricing requires confirmation based on extra bed policy.",
          description:
            "Lush green landscape, vibrant waterfalls, and tranquil rain-washed backwaters.",
        },
      ],
    },
    draftVersion: null,
    versions: [],
  },
  {
    id: "PKG-SI-12",
    slug: "madurai-rameswaram-kanyakumari",
    publishedVersionId: null,
    draftVersionId: "ver-pkg-si-12-v1",
    createdAt: "2026-01-18T09:00:00Z",
    updatedAt: "2026-01-20T11:00:00Z",
    publishedVersion: null,
    draftVersion: {
      id: "ver-pkg-si-12-v1",
      packageId: "PKG-SI-12",
      versionNumber: 1,
      status: "draft",
      title: "Madurai, Rameswaram and Kanyakumari",
      destination: "Tamil Nadu & South India",
      durationDays: 5,
      hotelCategory: "3 star",
      overview:
        "A sacred and historic pilgrimage trail through South India's majestic Dravidian temples, the sea-spanning Pamban bridge at Rameswaram, and the confluence of three oceans at Cape Comorin.",
      itinerary: [
        {
          day: 1,
          title: "Madurai Heritage & Meenakshi Temple",
          description:
            "Arrival in Madurai. Afternoon visit to the historic Meenakshi Amman Temple and Thirumalai Nayakkar Palace. Evening night ceremony at the temple.",
          stay: "3-Star Hotel, Madurai",
        },
        {
          day: 2,
          title: "Madurai to Rameswaram via Pamban Bridge",
          description:
            "Drive across the magnificent engineering marvel Pamban Bridge into Rameswaram island. Ramanathaswamy temple darshan and holy water theerthams.",
          stay: "3-Star Hotel, Rameswaram",
        },
        {
          day: 3,
          title: "Dhanushkodi Exploration & Journey to Kanyakumari",
          description:
            "Morning excursion to ghost town Dhanushkodi and Rama Setu viewpoint. Drive southwards towards Kanyakumari. Sunset view at the cape.",
          stay: "3-Star Oceanfront Hotel, Kanyakumari",
        },
        {
          day: 4,
          title: "Kanyakumari Sunrise & Memorials",
          description:
            "Witness sunrise over the confluence of Indian Ocean, Arabian Sea, and Bay of Bengal. Ferry to Vivekananda Rock Memorial and Thiruvalluvar Statue.",
          stay: "3-Star Oceanfront Hotel, Kanyakumari",
        },
        {
          day: 5,
          title: "Departure via Trivandrum",
          description:
            "Transfer to Trivandrum International Airport or Railway Station for onward journey.",
          stay: "Departure",
        },
      ],
      inclusions: [
        "Accommodation in 3-star certified heritage & boutique hotels",
        "Breakfast included on all days",
        "Private air-conditioned car for all transfers and temple tours",
        "All toll taxes, parking, and driver allowances",
      ],
      exclusions: [
        "Temple special entry tickets or pooja fees",
        "Lunch and dinners unless specified",
        "Train or flight tickets",
        "5% GST applicable additionally",
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
          caption: "Historic South Indian temple architecture",
          isHero: true,
        },
        {
          url: "https://images.unsplash.com/photo-1621641147575-d918a514d4e0?auto=format&fit=crop&w=1200&q=80",
          caption: "Vivekananda Rock Memorial in Kanyakumari",
          isHero: false,
        },
      ],
      routeMap: [
        { name: "Madurai", order: 1 },
        { name: "Rameswaram", order: 2 },
        { name: "Dhanushkodi", order: 3 },
        { name: "Kanyakumari", order: 4 },
        { name: "Trivandrum", order: 5 },
      ],
      seoTitle: "Madurai, Rameswaram & Kanyakumari 5 Days Tour | TripCanvas",
      seoDescription:
        "Explore the soul of South India across historic temples and coastlines.",
      priceBasis: "per person on twin sharing basis",
      gstDisclosure: "5% GST applicable additionally",
      prices: [
        {
          id: "prc-si12-all-year",
          seasonName: "All Year Standard",
          startMonth: 1,
          endMonth: 12,
          pricePerPerson: 18750,
          currency: "INR",
          childPriceNotes: "Child pricing requires confirmation.",
          description:
            "Standard year-round pricing covering Madurai, Rameswaram, and Kanyakumari.",
        },
      ],
    },
    versions: [],
  },
  {
    id: "PKG-KL-03",
    slug: "wayanad-rainforest-and-wildlife",
    publishedVersionId: "ver-pkg-kl-03-v1",
    draftVersionId: null,
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-01-25T10:00:00Z",
    publishedVersion: {
      id: "ver-pkg-kl-03-v1",
      packageId: "PKG-KL-03",
      versionNumber: 1,
      status: "published",
      title: "Wayanad Rainforest Retreat & Wildlife",
      destination: "Kerala (Wayanad Hills)",
      durationDays: 4,
      hotelCategory: "4 star",
      overview:
        "Escape into the ancient Western Ghats rainforest. Explore prehistoric Edakkal caves, Chembra Peak heart lake views, bamboo rafting in Kuruva Island, and wild elephant corridors.",
      itinerary: [
        {
          day: 1,
          title: "Calicut Arrival & Ascent to Wayanad",
          description:
            "Pickup from Calicut Airport. Drive through the famous 9 hairpin bends of Thamarassery Churam. Check in to an eco-luxury rainforest treehouse or cottage.",
          stay: "Rainforest Eco-Lodge, Wayanad",
        },
        {
          day: 2,
          title: "Edakkal Caves & Heritage Trail",
          description:
            "Morning climb to Neolithic petroglyphs at Edakkal Caves. Afternoon plantation tour and soochipara waterfalls.",
          stay: "Rainforest Eco-Lodge, Wayanad",
        },
        {
          day: 3,
          title: "Kuruva Island Bamboo Rafting & Tholpetty Safari",
          description:
            "Glide on natural bamboo rafts through dense riverine forests. Late afternoon wildlife jeep safari in Tholpetty sanctuary.",
          stay: "Rainforest Eco-Lodge, Wayanad",
        },
        {
          day: 4,
          title: "Banasura Sagar Dam & Calicut Departure",
          description:
            "Visit India's largest earthen dam at Banasura Sagar. Transfer back to Calicut for onward flight or train.",
          stay: "Departure",
        },
      ],
      inclusions: [
        "3 nights accommodation in eco-resort on twin sharing basis",
        "Daily breakfast and traditional plantation dinners",
        "Private AC vehicle for all transfers and sightseeing",
        "Tholpetty Wildlife Sanctuary jeep safari",
        "All interstate toll fees and driver allowances",
      ],
      exclusions: [
        "Air/Train tickets",
        "Camera entry fees at national parks",
        "Personal expenses",
        "5% GST applicable additionally",
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
          caption: "Wayanad mist-shrouded rainforest hills",
          isHero: true,
        },
      ],
      seoTitle: "Wayanad Rainforest & Wildlife 4 Days Tour | TripCanvas",
      seoDescription:
        "Experience the deep Western Ghats wilderness of Wayanad in 4 curated days.",
      priceBasis: "per person on twin sharing basis",
      gstDisclosure: "5% GST applicable additionally",
      publishedAt: "2026-01-25T10:00:00Z",
      prices: [
        {
          id: "prc-kl03-all",
          seasonName: "Standard Season (Sept–April)",
          startMonth: 9,
          endMonth: 4,
          pricePerPerson: 21500,
          currency: "INR",
          childPriceNotes: "Child pricing requires confirmation.",
          description: "Comfortable weather for rainforest hiking and wildlife spotting.",
        },
      ],
    },
    draftVersion: null,
    versions: [],
  },
  {
    id: "PKG-KL-05",
    slug: "kochi-heritage-and-marari-beach",
    publishedVersionId: "ver-pkg-kl-05-v1",
    draftVersionId: null,
    createdAt: "2026-01-25T11:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
    publishedVersion: {
      id: "ver-pkg-kl-05-v1",
      packageId: "PKG-KL-05",
      versionNumber: 1,
      status: "published",
      title: "Kochi Heritage & Marari Beach Solitude",
      destination: "Kerala (Kochi & Marari)",
      durationDays: 4,
      hotelCategory: "5 star",
      overview:
        "Immerse yourself in 500 years of colonial history in Fort Kochi followed by unhurried seaside relaxation along the coconut-fringed Marari coastline in an authentic heritage villa.",
      itinerary: [
        {
          day: 1,
          title: "Fort Kochi Colonial Walk & Chinese Fishing Nets",
          description:
            "Check into a restored Dutch heritage hotel. Sunset stroll by the cantilevered Chinese fishing nets and St. Francis Church.",
          stay: "Heritage Boutique Villa, Fort Kochi",
        },
        {
          day: 2,
          title: "Jew Town, Spice Markets & Drive to Marari",
          description:
            "Morning exploration of Paradesi Synagogue and antique lanes in Mattancherry. Afternoon transfer to Marari Beach.",
          stay: "5-Star Seaside Resort, Marari",
        },
        {
          day: 3,
          title: "Marari Seaside Relaxation & Ayurvedic Wellness",
          description:
            "A full day of serene coastal leisure, beach walks, bicycle village rides, and an authentic Ayurvedic massage session.",
          stay: "5-Star Seaside Resort, Marari",
        },
        {
          day: 4,
          title: "Departure from Cochin",
          description:
            "Leisurely breakfast overlooking the Arabian Sea. Private transfer to Cochin International Airport.",
          stay: "Departure",
        },
      ],
      inclusions: [
        "1 night Fort Kochi heritage property + 2 nights Marari luxury resort",
        "Twin sharing basis with daily breakfast",
        "Fort Kochi walking heritage tour with licensed historian",
        "Private AC luxury sedan for all movements",
      ],
      exclusions: [
        "Airfare",
        "Meals other than breakfast",
        "Ayurvedic treatments (available on request)",
        "5% GST applicable additionally",
      ],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
          caption: "Historic Fort Kochi Chinese fishing nets",
          isHero: true,
        },
      ],
      seoTitle: "Kochi Heritage & Marari Beach 4 Days Luxury Break | TripCanvas",
      seoDescription:
        "Relax in colonial luxury and pristine coastal solitude across Kochi and Marari.",
      priceBasis: "per person on twin sharing basis",
      gstDisclosure: "5% GST applicable additionally",
      publishedAt: "2026-01-28T14:00:00Z",
      prices: [
        {
          id: "prc-kl05-all",
          seasonName: "All Year Luxury",
          startMonth: 1,
          endMonth: 12,
          pricePerPerson: 28900,
          currency: "INR",
          childPriceNotes: "Child pricing requires confirmation.",
          description: "Curated boutique 5-star experience available year-round.",
        },
      ],
    },
    draftVersion: null,
    versions: [],
  },
];

export const initialEnquiries: EnquiryRecord[] = [
  {
    id: "enq-001",
    enquiryNumber: "ENQ-2026-001",
    fullName: "Rohan Sharma",
    email: "rohan.sharma.demo@example.com",
    phone: "+91 98765 43210",
    packageId: "PKG-KL-07",
    packageSlug: "munnar-thekkady-alleppey-houseboat",
    destination: "Kerala",
    travelStartDate: "2026-12-15",
    travelDuration: "5-6 nights",
    adultsCount: 2,
    childrenCount: 1,
    budget: 120000,
    currency: "INR",
    specialRequirements:
      "Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must.",
    whatsappConsent: true,
    status: "new",
    assignedConsultantId: "00000000-0000-0000-0000-000000000003",
    assignedConsultantName: "Deepa Kurian",
    responseDeadline: "2026-11-03T18:00:00Z",
    channel: "website",
    createdAt: "2026-11-02T14:20:00Z",
    updatedAt: "2026-11-02T14:20:00Z",
  },
  {
    id: "enq-002",
    enquiryNumber: "ENQ-2026-002",
    fullName: "Ananya Iyer",
    email: "ananya.iyer.demo@example.com",
    phone: "+91 98111 22334",
    packageId: null,
    packageSlug: null,
    destination: "Tamil Nadu & South India",
    travelStartDate: "2026-11-20",
    travelDuration: "4-5 days",
    adultsCount: 2,
    childrenCount: 0,
    budget: 45000,
    currency: "INR",
    specialRequirements:
      "Looking for a peaceful temple tour covering Rameswaram and Kanyakumari for elderly parents. Need comfortable sedan with experienced driver.",
    whatsappConsent: true,
    status: "assigned",
    assignedConsultantId: "00000000-0000-0000-0000-000000000003",
    assignedConsultantName: "Deepa Kurian",
    responseDeadline: "2026-11-03T12:00:00Z",
    channel: "website",
    createdAt: "2026-11-02T11:15:00Z",
    updatedAt: "2026-11-02T12:00:00Z",
  },
  {
    id: "enq-003",
    enquiryNumber: "ENQ-2026-003",
    fullName: "David Richardson",
    email: "david.r.travel@example.com",
    phone: "+44 7700 900123",
    packageId: "PKG-KL-07",
    packageSlug: "munnar-thekkady-alleppey-houseboat",
    destination: "Kerala",
    travelStartDate: "2027-01-10",
    travelDuration: "7 days",
    adultsCount: 2,
    childrenCount: 0,
    budget: 100000,
    currency: "INR",
    specialRequirements:
      "Interested in bird watching and Ayurvedic massage options alongside the houseboat stay. Vegetarian dining preferred.",
    whatsappConsent: false,
    status: "in_progress",
    assignedConsultantId: "00000000-0000-0000-0000-000000000003",
    assignedConsultantName: "Deepa Kurian",
    responseDeadline: "2026-11-02T22:00:00Z",
    channel: "website",
    createdAt: "2026-11-01T22:00:00Z",
    updatedAt: "2026-11-02T09:30:00Z",
  },
];

export const initialAiExtractions: Record<string, AiExtractionRecord> = {
  "enq-001": {
    id: "ext-001",
    enquiryId: "enq-001",
    originalMessage:
      "Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must.",
    destination: "Kerala",
    arrivalDateOrMonth: "December",
    duration: "5-6 nights",
    adultsCount: 2,
    childrenCount: 1,
    budget: 120000,
    currency: "INR",
    requiredExperiences: ["Houseboat", "Munnar Hills", "Backwaters"],
    specialRequirements: "Houseboat stay is essential. Extra bed required for 1 child.",
    extractionStatus: "success",
    reviewNeeded: false,
    confidenceScore: 0.95,
    modelInfo: "gemini-flash-lite-latest",
    createdAt: "2026-11-02T14:21:00Z",
    updatedAt: "2026-11-02T14:21:00Z",
  },
};

export const initialPackageSuggestions: Record<string, PackageSuggestionRecord[]> = {
  "enq-001": [
    {
      id: "sug-001",
      enquiryId: "enq-001",
      packageId: "PKG-KL-07",
      packageTitle: "Munnar, Thekkady and Alleppey Houseboat",
      packageSlug: "munnar-thekkady-alleppey-houseboat",
      durationDays: 6,
      startingPrice: 32500,
      currency: "INR",
      score: 95,
      matchReasons: [
        "Exact destination match (Kerala)",
        "Includes private Alleppey houseboat experience requested by customer",
        "Duration (6 days) fits requested 5-6 nights",
        "Base adult cost (2 x ₹32,500 = ₹65,000) falls well within ₹1,20,000 total budget",
        "Child pricing requires consultant confirmation",
      ],
      createdAt: "2026-11-02T14:21:05Z",
    },
  ],
};

export const initialEnquiryNotes: Record<string, EnquiryNote[]> = {
  "enq-001": [
    {
      id: "note-001",
      enquiryId: "enq-001",
      authorId: "00000000-0000-0000-0000-000000000003",
      authorName: "Deepa Kurian",
      note: "Checked houseboat availability for mid-December. Need to confirm extra rollaway bed charge with the Alleppey boat captain.",
      createdAt: "2026-11-02T14:30:00Z",
    },
  ],
};

export const initialActivityLogs: ActivityLogRecord[] = [
  {
    id: "act-001",
    actorEmail: "admin@tripcanvas.internal",
    action: "package.published",
    entityType: "package",
    entityId: "PKG-KL-07",
    metadata: { version: 1, title: "Munnar, Thekkady and Alleppey Houseboat" },
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "act-002",
    actorEmail: "editor@tripcanvas.internal",
    action: "package.created",
    entityType: "package",
    entityId: "PKG-SI-12",
    metadata: { version: 1, title: "Madurai, Rameswaram and Kanyakumari", status: "draft" },
    createdAt: "2026-01-20T11:00:00Z",
  },
  {
    id: "act-003",
    actorEmail: "system",
    action: "enquiry.created",
    entityType: "enquiry",
    entityId: "ENQ-2026-001",
    metadata: { customer: "Rohan Sharma", destination: "Kerala" },
    createdAt: "2026-11-02T14:20:00Z",
  },
  {
    id: "act-004",
    actorEmail: "admin@tripcanvas.internal",
    action: "enquiry.assigned",
    entityType: "enquiry",
    entityId: "ENQ-2026-001",
    metadata: { assignedTo: "Deepa Kurian" },
    createdAt: "2026-11-02T14:25:00Z",
  },
];

export const initialRedirects: LegacyRedirectRecord[] = [
  {
    id: "red-001",
    sourcePath: "/tours/kerala-houseboat-6days.html",
    targetPath: "/packages/munnar-thekkady-alleppey-houseboat",
    statusCode: 301,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "red-002",
    sourcePath: "/packages/old-munnar-thekkady.php",
    targetPath: "/packages/munnar-thekkady-alleppey-houseboat",
    statusCode: 301,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "red-003",
    sourcePath: "/destinations/south-india/rameswaram.html",
    targetPath: "/packages/madurai-rameswaram-kanyakumari",
    statusCode: 301,
    createdAt: "2026-01-01T00:00:00Z",
  },
];


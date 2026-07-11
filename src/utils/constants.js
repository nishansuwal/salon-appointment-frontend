export const SALON = {
  name: "Luma & Co. Salon",
  tagline: "Thoughtful beauty appointments, handled end to end.",
  phone: "+977 980-123-4567",
  email: "hello@lumasalon.test",
  address: "Lakeside Avenue, Pokhara",
  hours: "Sun-Fri, 9:00 AM - 7:00 PM",
};

export const SERVICE_CATEGORIES = ["All", "Hair", "Skin", "Nails", "Makeup"];

export const SERVICES = [
  {
    id: "hair-cut-style",
    name: "Cut & Signature Styling",
    slug: "cut-signature-styling",
    category: "Hair",
    duration: 60,
    price: 1800,
    description: "Consultation-led haircut, wash, blow dry, and finish.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    staffIds: ["maya", "nisha", "tara"],
  },
  {
    id: "hair-color-gloss",
    name: "Color Gloss Treatment",
    slug: "color-gloss",
    category: "Hair",
    duration: 90,
    price: 3600,
    description: "High-shine color refresh with tone balancing and aftercare.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    staffIds: ["maya", "aarav"],
  },
  {
    id: "hydrating-facial",
    name: "Hydrating Glow Facial",
    slug: "hydrating-glow-facial",
    category: "Skin",
    duration: 75,
    price: 2500,
    description: "Cleanse, gentle exfoliation, massage, and custom mask.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
    staffIds: ["sima", "tara"],
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    slug: "gel-manicure",
    category: "Nails",
    duration: 50,
    price: 1400,
    description: "Cuticle care, shaping, long-wear gel polish, and hand balm.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
    staffIds: ["nisha", "sima"],
  },
  {
    id: "bridal-makeup",
    name: "Event Makeup",
    slug: "event-makeup",
    category: "Makeup",
    duration: 120,
    price: 5500,
    description: "Camera-ready makeup with skin prep, lashes, and setting.",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
    staffIds: ["tara", "aarav"],
  },
];

export const STAFF = [
  // {
  //   id: "maya",
  //   name: "no preference",
  // },
  {
    id: "maya",
    name: "Maya Shrestha",
    role: "Senior Hair Artist",
    rating: 4.9,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    skills: ["Cutting", "Color", "Styling"],
  },
  {
    id: "nisha",
    name: "Nisha Gurung",
    role: "Stylist & Nail Tech",
    rating: 4.8,
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
    skills: ["Styling", "Manicure", "Finishing"],
  },
  {
    id: "sima",
    name: "Sima Thapa",
    role: "Skin Therapist",
    rating: 4.9,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    skills: ["Facials", "Nails", "Massage"],
  },
  {
    id: "tara",
    name: "Tara Rana",
    role: "Makeup & Skin Specialist",
    rating: 4.7,
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80",
    skills: ["Makeup", "Facials", "Styling"],
  },
  {
    id: "aarav",
    name: "Aarav K.C.",
    role: "Colorist & Makeup Artist",
    rating: 4.8,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    skills: ["Color", "Makeup", "Consultation"],
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-1024",
    customerName: "Aarati Karki",
    customerEmail: "aarati@example.com",
    serviceId: "hair-cut-style",
    staffId: "maya",
    date: "2026-06-24",
    time: "10:00",
    status: "Confirmed",
    notes: "Prefers soft layers and natural finish.",
  },
  {
    id: "APT-1025",
    customerName: "Riya Sharma",
    customerEmail: "riya@example.com",
    serviceId: "hydrating-facial",
    staffId: "sima",
    date: "2026-06-25",
    time: "14:30",
    status: "Pending",
    notes: "Sensitive skin.",
  },
  {
    id: "APT-1026",
    customerName: "Nabin Rai",
    customerEmail: "nabin@example.com",
    serviceId: "hair-color-gloss",
    staffId: "aarav",
    date: "2026-06-23",
    time: "16:00",
    status: "Confirmed",
    notes: "Color consultation before service.",
  },
];

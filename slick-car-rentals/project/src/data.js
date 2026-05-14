// Slick Car Rentals — fleet + mock data
// Photos use model-matched Wikimedia Commons files; users can swap with real fleet photos later.

const commonsImage = (file, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const commonsPage = (file) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g, "_")}`;

const photo = (file, credit, license) => ({
  img: commonsImage(file),
  imgPage: commonsPage(file),
  imgCredit: credit,
  imgLicense: license,
});

const CARS = [
  // Economy
  { id: "c01", name: "Toyota Corolla", year: 2024, tier: "Economy", tierClass: "tier-economy", price: 79, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 2, doors: 4, mileage: "Unlimited", ...photo("Toyota Corolla Sedan.jpg", "Guillaume Vachey / Wikimedia Commons", "CC BY 2.0"), blurb: "Reliable, fuel-efficient, and easy on parking. Our most popular weekend rental.", features: ["Bluetooth", "Reverse camera", "Apple CarPlay", "Cruise control"] },
  { id: "c02", name: "Hyundai i30", year: 2023, tier: "Economy", tierClass: "tier-economy", price: 75, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 2, doors: 5, mileage: "Unlimited", ...photo("Hyundai i30 PD Polar White (3).jpg", "Damian B Oh / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Hatch practicality with great economy — perfect for the city.", features: ["Bluetooth", "Reverse camera", "Android Auto", "USB-C"] },
  { id: "c03", name: "Mazda 3", year: 2024, tier: "Economy", tierClass: "tier-economy", price: 89, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 2, doors: 4, mileage: "Unlimited", ...photo("2024 Mazda3 (BP) G20 Evolve sedan, Verdun, South Australia 2024-03-07.jpg", "RegionVisitor90 / Wikimedia Commons", "CC0"), blurb: "A sharp drive with a premium feel for the price.", features: ["Heads-up display", "Apple CarPlay", "Leather wheel", "Climate"] },
  { id: "c04", name: "Honda Civic", year: 2024, tier: "Economy", tierClass: "tier-economy", price: 85, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 2, doors: 4, mileage: "Unlimited", ...photo("2022 Honda Civic LX Sedan, front right, 11-02-2022.jpg", "MercurySable99 / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Refined, comfortable, and built to last.", features: ["Adaptive cruise", "Lane assist", "CarPlay", "Climate"] },

  // Family / SUV
  { id: "c05", name: "Toyota RAV4", year: 2024, tier: "Family SUV", tierClass: "tier-family", price: 129, seats: 5, transmission: "Auto", fuel: "Hybrid", luggage: 4, doors: 5, mileage: "Unlimited", ...photo("2024 Toyota RAV4 - red.jpg", "Ssu / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Hybrid efficiency with proper SUV space. Great for road trips.", features: ["AWD", "Hybrid", "Roof rails", "Heated seats"] },
  { id: "c06", name: "Mazda CX-5", year: 2024, tier: "Family SUV", tierClass: "tier-family", price: 135, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 4, doors: 5, mileage: "Unlimited", ...photo("Mazda CX-5 (2024) (53939321110).jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "Premium feel inside, sharp lines outside.", features: ["AWD", "Leather", "Heads-up display", "Bose audio"] },
  { id: "c07", name: "Hyundai Tucson", year: 2024, tier: "Family SUV", tierClass: "tier-family", price: 125, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 4, doors: 5, mileage: "Unlimited", ...photo("Hyundai Tucson 2.0 Plus 2024 (54213125649).jpg", "RL GNZLZ / Wikimedia Commons", "CC BY-SA 2.0"), blurb: "Bold styling and a generous boot for the school run or a weekend escape.", features: ["AWD", "Panoramic roof", "CarPlay", "Heated seats"] },
  { id: "c08", name: "Kia Sportage", year: 2024, tier: "Family SUV", tierClass: "tier-family", price: 119, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 4, doors: 5, mileage: "Unlimited", ...photo("Kia Sportage 1.6 T-GDI (2024) (54733793881).jpg", "Charles / Wikimedia Commons", "CC0"), blurb: "Modern interior with all the tech you need for family trips.", features: ["Lane assist", "Wireless charging", "CarPlay", "Climate"] },

  // Ute / 4WD
  { id: "c09", name: "Toyota HiLux SR5", year: 2024, tier: "Ute / 4WD", tierClass: "tier-ute", price: 159, seats: 5, transmission: "Auto", fuel: "Diesel", luggage: 6, doors: 4, mileage: "Unlimited", ...photo("Toyota Hilux 2.8 GR Sport 4x4 2024.jpg", "Ethan Llamas / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Bulletproof. Take the trailer, the boat, or the boys — it'll all fit.", features: ["4WD", "Tow bar", "Tray liner", "Diff lock"] },
  { id: "c10", name: "Ford Ranger Wildtrak", year: 2024, tier: "Ute / 4WD", tierClass: "tier-ute", price: 165, seats: 5, transmission: "Auto", fuel: "Diesel", luggage: 6, doors: 4, mileage: "Unlimited", ...photo("Ford Ranger 2.0 Wildtrak 4x2 2024 (1).jpg", "Ethan Llamas / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Premium ute. Comfortable on the highway, capable off it.", features: ["4WD", "Tow bar", "Roller cover", "Heated seats"] },
  { id: "c11", name: "Isuzu D-Max", year: 2023, tier: "Ute / 4WD", tierClass: "tier-ute", price: 149, seats: 5, transmission: "Auto", fuel: "Diesel", luggage: 6, doors: 4, mileage: "Unlimited", ...photo("Isuzu D-Max 4x2 LSA 2023.jpg", "Captainmorlypogi1959 / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Work-ute simple, dependable on a long day.", features: ["4WD", "Tow bar", "Tray liner", "Cruise"] },
  { id: "c12", name: "Toyota LandCruiser", year: 2024, tier: "Ute / 4WD", tierClass: "tier-ute", price: 249, seats: 7, transmission: "Auto", fuel: "Diesel", luggage: 6, doors: 5, mileage: "Unlimited", ...photo("2024 Toyota Land Cruiser (United States) front view.jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "The big rig — 7 seats, will-go-anywhere, properly loaded.", features: ["4WD", "7 seats", "Leather", "Crawl control"] },

  // Premium
  { id: "c13", name: "BMW 330i", year: 2024, tier: "Premium", tierClass: "tier-premium", price: 229, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "Unlimited", ...photo("BMW 3-Series (G20) 330i (2020) (52184513944).jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "The benchmark sports sedan. Sharp, fast, deeply satisfying.", features: ["M Sport", "Heads-up display", "Harman Kardon", "Adaptive cruise"] },
  { id: "c14", name: "Mercedes-Benz C300", year: 2023, tier: "Premium", tierClass: "tier-premium", price: 239, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "Unlimited", ...photo("Mercedes-Benz C-Klasse (W206) C 300 (2023) (53491181737).jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "Quiet, refined, and feels expensive from the moment you sit in.", features: ["MBUX", "Burmester audio", "Heated seats", "Ambient lighting"] },
  { id: "c15", name: "Audi A4", year: 2024, tier: "Premium", tierClass: "tier-premium", price: 235, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "Unlimited", ...photo("Audi A4 172104.jpg", "Trop86 / Wikimedia Commons", "CC0"), blurb: "Understated, beautifully finished, quattro confidence in any weather.", features: ["Quattro AWD", "Virtual cockpit", "Bang & Olufsen", "Matrix LED"] },
  { id: "c16", name: "Lexus IS 350", year: 2024, tier: "Premium", tierClass: "tier-premium", price: 219, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "Unlimited", ...photo("'14 Lexus IS 350 (MIAS '14).jpg", "Bull-Doser / Wikimedia Commons", "Public domain"), blurb: "Bold styling, sublime build quality, and Lexus's legendary refinement.", features: ["Mark Levinson", "Heated seats", "Lane assist", "Sunroof"] },

  // Luxury / Sports
  { id: "c17", name: "BMW M3 Competition", year: 2024, tier: "Luxury Sport", tierClass: "tier-luxury", price: 399, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "200km/day", ...photo("BMW M3 Competition 001.jpg", "Kidfly182 / Wikimedia Commons", "CC BY 4.0"), blurb: "510hp of pure intent. The most fun you can have on four wheels with the kids in the back.", features: ["510hp inline-6", "Carbon trim", "M differential", "Track mode"] },
  { id: "c18", name: "Mercedes-AMG C63", year: 2023, tier: "Luxury Sport", tierClass: "tier-luxury", price: 429, seats: 5, transmission: "Auto", fuel: "Petrol", luggage: 3, doors: 4, mileage: "200km/day", ...photo("Mercedes-AMG C 63 (W206) IMG 0305.jpg", "Alexander-93 / Wikimedia Commons", "CC BY-SA 4.0"), blurb: "Twin-turbo V8 thunder in a sharp suit. AMG mode is not optional.", features: ["V8 biturbo", "AMG Ride", "Burmester 3D", "Performance seats"] },
  { id: "c19", name: "Porsche 911 Carrera", year: 2023, tier: "Luxury Sport", tierClass: "tier-luxury", price: 599, seats: 4, transmission: "Auto", fuel: "Petrol", luggage: 2, doors: 2, mileage: "150km/day", ...photo("Porsche 911 Carrera 4S (992, 2023) (53941359203).jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "An icon. Bucket-list driving for that big weekend.", features: ["Flat-six", "Sport Chrono", "PASM", "BOSE audio"] },
  { id: "c20", name: "Ford Mustang GT", year: 2024, tier: "Luxury Sport", tierClass: "tier-luxury", price: 289, seats: 4, transmission: "Manual", fuel: "Petrol", luggage: 2, doors: 2, mileage: "200km/day", ...photo("Ford Mustang GT (2024) (53801054726).jpg", "Charles / Wikimedia Commons", "CC BY 2.0"), blurb: "5.0L V8, six-speed manual, Coyote-engine soundtrack on tap.", features: ["5.0L V8", "Manual", "Active exhaust", "Recaro seats"] },
];

const TIERS = ["All", "Economy", "Family SUV", "Ute / 4WD", "Premium", "Luxury Sport"];

// helpers
const fmtDate = (d) => {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};
const fmtDateShort = (d) => {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
};
const isoDay = (d) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};
const parseIso = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const daysBetween = (a, b) => {
  if (!a || !b) return 0;
  const A = typeof a === "string" ? parseIso(a) : a;
  const B = typeof b === "string" ? parseIso(b) : b;
  return Math.max(1, Math.round((B - A) / 86400000));
};
const todayIso = () => isoDay(new Date());
const addDays = (d, n) => {
  const dt = typeof d === "string" ? parseIso(d) : new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
};

// mock bookings — distributed across the fleet for the next 30 days
function buildMockBookings() {
  const today = new Date();
  const make = (carId, startOffset, len, name, status = "confirmed") => {
    const start = addDays(today, startOffset);
    const end = addDays(start, len);
    return {
      id: "BK" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      carId, start: isoDay(start), end: isoDay(end),
      name, status,
    };
  };
  return [
    make("c01", 1, 3, "Sarah Mitchell"),
    make("c01", 8, 2, "James O'Connor"),
    make("c02", 0, 4, "Priya Nair"),
    make("c03", 2, 2, "Tom Bailey"),
    make("c05", 3, 7, "The Nguyen Family"),
    make("c05", 14, 3, "Hassan Ali"),
    make("c06", 5, 4, "Emma Whitford"),
    make("c08", 1, 2, "Daniel Park"),
    make("c09", 0, 5, "Bluegum Builders Pty Ltd"),
    make("c10", 6, 3, "Nathan Tipene"),
    make("c12", 10, 4, "The Ferguson Family"),
    make("c13", 2, 2, "Lukas Vogel"),
    make("c14", 7, 1, "Olivia Chen", "pending"),
    make("c17", 12, 2, "Marco Bianchi"),
    make("c19", 18, 2, "R. Henderson"),
    make("c20", 4, 2, "Beck & Vicky"),
  ];
}

// mock blocked dates (admin maintenance blocks)
function buildMockBlocks() {
  const today = new Date();
  const block = (carId, offset, len) => ({
    carId, start: isoDay(addDays(today, offset)), end: isoDay(addDays(today, offset + len)),
    reason: ["Service", "Detailing", "Tyre rotation", "Maintenance"][Math.floor(Math.random()*4)],
  });
  return [
    block("c03", 20, 2),
    block("c07", 4, 1),
    block("c11", 16, 3),
    block("c15", 22, 2),
    block("c18", 9, 2),
  ];
}

// pricing helpers — discount tiers
function priceFor(car, days) {
  const base = car.price * days;
  let discountPct = 0;
  let discountLabel = null;
  if (days >= 28) { discountPct = 0.20; discountLabel = "Monthly · 20% off"; }
  else if (days >= 7) { discountPct = 0.10; discountLabel = "Weekly · 10% off"; }
  const discount = Math.round(base * discountPct);
  const subtotal = base - discount;
  const insurance = Math.round(subtotal * 0.12);
  const total = subtotal + insurance;
  return { base, discount, discountPct, discountLabel, subtotal, insurance, total };
}

// CTA copy variants — matey vs neutral
const COPY = {
  matey: {
    hero_h1_a: "Pick up the keys.",
    hero_h1_b: "Hit the road.",
    hero_sub: "Late-model rentals from a family-run yard. From a thrifty hatch to a thumping V8 — book online in 90 seconds, no agency rubbish.",
    cta_book: "Book a Car",
    cta_book_now: "Book Now",
    cta_browse: "Browse the Fleet",
    cta_start: "Start Booking",
    cta_call: "Call 0423 410 701",
    section_fleet_h2_a: "20 cars.",
    section_fleet_h2_b: "One simple yard.",
    section_how_a: "Three steps.",
    section_how_b: "No paperwork drama.",
    cta_final_a: "Book your car in",
    cta_final_b: "90 seconds.",
    cta_final_sub: "No accounts. No agency mark-up. Just keys, kilometres, and the road.",
    booking_h1: "Lock in your wheels.",
    review_h2: "Right then — last look.",
    review_sub: "Eyeball the details. Hit confirm and you're done.",
    confirm_btn: "Confirm Booking",
    fleet_h1_a: "Every car.",
    fleet_h1_b: "Every spec.",
  },
  neutral: {
    hero_h1_a: "Drive what suits you.",
    hero_h1_b: "Book it in minutes.",
    hero_sub: "Modern vehicles for every trip — economy hatches, family SUVs, work utes, and premium sedans. Transparent pricing, no hidden fees.",
    cta_book: "Reserve a Car",
    cta_book_now: "Reserve",
    cta_browse: "View Fleet",
    cta_start: "Start a Booking",
    cta_call: "Call 0423 410 701",
    section_fleet_h2_a: "20 vehicles.",
    section_fleet_h2_b: "Carefully maintained.",
    section_how_a: "Three steps.",
    section_how_b: "Simple, transparent process.",
    cta_final_a: "Reserve your car in",
    cta_final_b: "under two minutes.",
    cta_final_sub: "No account required. Pay on pickup. Comprehensive insurance included.",
    booking_h1: "Complete your reservation.",
    review_h2: "Review your booking.",
    review_sub: "Please confirm the details below before submitting.",
    confirm_btn: "Confirm Reservation",
    fleet_h1_a: "Our fleet.",
    fleet_h1_b: "All vehicles.",
  },
};

window.SLICK = {
  CARS, TIERS,
  fmtDate, fmtDateShort, isoDay, parseIso, daysBetween, todayIso, addDays,
  buildMockBookings, buildMockBlocks,
  priceFor, COPY,
};

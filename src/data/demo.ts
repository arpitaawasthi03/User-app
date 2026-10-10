/**
 * DEMO DATA — RoadRider has no backend integration in this project.
 * Everything in this file is demonstration content taken from the approved Figma reference
 * (names, prices, photos, copy). Replace with API calls when a backend becomes available.
 */

export type Service = "food" | "rides" | "grocery" | "courier";

export const PHOTOS = {
  rider: "https://images.unsplash.com/photo-1768423083233-b3f696c9b703?auto=format&fit=crop&w=1080&q=85",
  food: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1080&q=85",
  food2: "https://images.unsplash.com/photo-1705174299330-939dd03cc864?auto=format&fit=crop&w=800&q=80",
  grocery: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1080&q=85",
  produce: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80",
  ride: "https://images.unsplash.com/photo-1541702467897-41915a07d3a7?auto=format&fit=crop&w=1080&q=80",
};

export const SERVICES: Service[] = ["food", "rides", "grocery", "courier"];

export const serviceMeta: Record<Service, { label: string; kicker: string; photo: string; icon: string }> = {
  food: { label: "Food", kicker: "GOOD FOOD · BRIGHTER DAYS", photo: PHOTOS.food, icon: "food" },
  rides: { label: "Rides", kicker: "YOUR CITY, YOUR WAY", photo: PHOTOS.ride, icon: "car" },
  grocery: { label: "Grocery", kicker: "FARM FRESH · EVERYDAY", photo: PHOTOS.grocery, icon: "bag" },
  courier: { label: "Courier", kicker: "FAST · SAFE · RELIABLE", photo: PHOTOS.rider, icon: "box" },
};

/* ---------- Food ---------- */
export type MenuItem = { id: string; name: string; description: string; price: number };
export type Restaurant = {
  id: string; name: string; cuisines: string[]; eta: string; etaShort: string; rating: number;
  detailRating: number; discount: string; photo: string; menu: MenuItem[];
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "royal-biryani-house",
    name: "Royal Biryani House",
    cuisines: ["Mughlai", "North Indian", "Biryani"],
    eta: "30–35 min",
    etaShort: "30 min",
    rating: 4.7,
    detailRating: 4.8,
    discount: "20% OFF",
    photo: PHOTOS.food2,
    menu: [
      { id: "rbh-lucknowi-biryani", name: "Lucknowi Chicken Biryani", description: "Fragrant basmati rice, tender chicken & house spices", price: 289 },
      { id: "rbh-veg-dum-biryani", name: "Veg Dum Biryani", description: "Slow-cooked basmati rice with seasonal vegetables", price: 229 },
      { id: "rbh-galouti-kebab", name: "Galouti Kebab", description: "Melt-in-the-mouth minced kebabs with sheermal", price: 249 },
    ],
  },
];

export const FOOD_CATEGORIES: { icon: string; label: string }[] = [
  { icon: "🍕", label: "Pizza" },
  { icon: "🍔", label: "Burgers" },
  { icon: "🍲", label: "Biryani" },
  { icon: "🥡", label: "Chinese" },
];
export const MORE_CUISINES = ["Mughlai", "North Indian", "South Indian", "Desserts"];

/* ---------- Grocery ---------- */
export type Product = {
  id: string; name: string; unit: string; price: number; mrp: number; category: string; photo: string;
};
export const PRODUCTS: Product[] = [
  { id: "gr-tomatoes", name: "Farm fresh tomatoes", unit: "500 g", price: 32, mrp: 45, category: "Veggies", photo: PHOTOS.grocery },
  { id: "gr-broccoli", name: "Organic broccoli", unit: "1 piece", price: 69, mrp: 89, category: "Veggies", photo: PHOTOS.produce },
];
export const GROCERY_CATEGORIES: { abbr: string; label: string }[] = [
  { abbr: "FR", label: "Fruits" },
  { abbr: "VG", label: "Veggies" },
  { abbr: "ML", label: "Dairy" },
  { abbr: "SN", label: "Snacks" },
];

/* ---------- Rides ---------- */
export type RideOption = { id: string; abbr: string; name: string; range: string; eta: string; fare: number; tagline: string };
/** `fare` is a demonstration estimate inside the designed range. */
export const RIDE_OPTIONS: RideOption[] = [
  { id: "bike", abbr: "BIKE", name: "Bike", range: "₹48–62", eta: "3 min", fare: 55, tagline: "Quick solo rides" },
  { id: "auto", abbr: "AUTO", name: "Auto", range: "₹86–102", eta: "5 min", fare: 96, tagline: "Comfortable everyday rides" },
  { id: "cab", abbr: "CAB", name: "Cab", range: "₹148–176", eta: "7 min", fare: 162, tagline: "AC hatchbacks & sedans" },
  { id: "xl", abbr: "XL", name: "Cab XL", range: "₹218–245", eta: "9 min", fare: 232, tagline: "Room for 6 riders" },
];

/* ---------- Courier ---------- */
export type PackageType = { id: string; abbr: string; name: string; weight: string; range: string; time: string; price: number };
export const PACKAGE_TYPES: PackageType[] = [
  { id: "doc", abbr: "DOC", name: "Document", weight: "Up to 500 g", range: "₹79 – ₹99", time: "30–40 min", price: 89 },
  { id: "small", abbr: "S", name: "Small box", weight: "Up to 2 kg", range: "₹129 – ₹149", time: "35–45 min", price: 139 },
  { id: "medium", abbr: "M", name: "Medium box", weight: "Up to 5 kg", range: "₹179 – ₹209", time: "40–50 min", price: 194 },
  { id: "large", abbr: "L", name: "Large box", weight: "Up to 10 kg", range: "₹249 – ₹289", time: "45–60 min", price: 269 },
];

/* ---------- Places ---------- */
export type Place = { id: string; label: string; line: string; area: string; icon: "home" | "pin" };
export const SEED_PLACES: Place[] = [
  { id: "home", label: "Home", line: "15, Shahnajaf Road, Hazratganj", area: "Hazratganj, Lucknow", icon: "home" },
  { id: "work", label: "Work", line: "Vibhuti Khand, Gomti Nagar", area: "Gomti Nagar, Lucknow", icon: "pin" },
];

export const PARTNER = { name: "Arjun Singh", initials: "AS", rating: 4.9, trips: 820 };

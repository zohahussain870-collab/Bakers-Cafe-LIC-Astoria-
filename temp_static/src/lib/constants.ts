export const BUSINESS_INFO = {
  name: "Bakers Cafe LIC",
  type: "Halal Cafe & Bakery",
  address: "34-06 9th St, Astoria, NY 11106, USA",
  phone: "+1 718-489-9077",
  phoneClean: "+17184899077",
  whatsappNumber: "17184899077",
  email: "contact@bakerscafelic.com",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Bakers+Cafe+LIC+34-06+9th+St+Astoria+NY+11106",
  suppliedRating: {
    score: 4.9,
    maxScore: 5,
    count: 243,
    sourceNote: "243 Google reviews",
  },
  listedAvailability: "Open Daily · Dine-in, Takeout & Pickup",
  serviceType: "Dine-in, Takeout & Pickup",
  city: "Astoria",
  state: "NY",
  postalCode: "11106",
  country: "USA",
  timezone: "America/New_York",
  currency: "USD",
  notice:
    "Every order is freshly prepared. Advance notice (minimum 4-6 hours for standard items, 24 hours for artisan cakes) is recommended. Dine-in, takeout, and pickup are available; online orders are prepared for pickup.",
};

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending Confirmation", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "CONFIRMED", label: "Order Confirmed", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "PREPARING", label: "In Kitchen / Baking", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "READY_FOR_PICKUP", label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300" },
] as const;

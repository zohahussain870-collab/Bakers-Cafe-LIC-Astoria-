export const BUSINESS_INFO = {
  name: "Home Bakery",
  type: "Home-based bakery",
  address: "House R-1932, Block 17, Gulberg Town, Karachi, 75950, Pakistan",
  phone: "+92 330 2964562",
  phoneClean: "+923302964562",
  whatsappNumber: "923302964562",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Home+Bakery+House+R-1932+Block+17+Gulberg+Town+Karachi",
  suppliedRating: {
    score: 5.0,
    maxScore: 5,
    count: 1,
    sourceNote: "Supplied Google rating (1 review)",
  },
  listedAvailability: "Open 24 hours (Order placement & scheduled preparation)",
  serviceType: "Takeout (Default)",
  city: "Karachi",
  postalCode: "75950",
  country: "Pakistan",
  timezone: "Asia/Karachi",
  currency: "PKR",
  notice:
    "Because we are a dedicated home-based bakery, orders are freshly prepared upon request. Advance notice (minimum 4-6 hours for standard items, 24 hours for artisan cakes) is recommended. Takeout/pickup is our default service.",
};

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending Confirmation", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "CONFIRMED", label: "Order Confirmed", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "PREPARING", label: "In Kitchen / Baking", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "READY_FOR_PICKUP", label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300" },
] as const;

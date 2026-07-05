export const STORE_NAME = "Sugandha";
export const STORE_TAGLINE = "Discover Your Signature Scent";

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  { value: "confirmed", label: "Confirmed", color: "text-blue-600 bg-blue-50" },
  { value: "processing", label: "Processing", color: "text-indigo-600 bg-indigo-50" },
  { value: "packed", label: "Packed", color: "text-purple-600 bg-purple-50" },
  { value: "shipped", label: "Shipped", color: "text-cyan-600 bg-cyan-50" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "text-teal-600 bg-teal-50" },
  { value: "delivered", label: "Delivered", color: "text-green-600 bg-green-50" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600 bg-red-50" },
  { value: "returned", label: "Returned", color: "text-orange-600 bg-orange-50" },
  { value: "refunded", label: "Refunded", color: "text-pink-600 bg-pink-50" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

export const STOCK_STATUSES = [
  { value: "in_stock", label: "In Stock", color: "text-green-600" },
  { value: "low_stock", label: "Low Stock", color: "text-orange-600" },
  { value: "out_of_stock", label: "Out of Stock", color: "text-red-600" },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format";

export const HOMEPAGE_SECTIONS = [
  { key: "hero", label: "Hero Banner" },
  { key: "best_sellers", label: "Best Sellers" },
  { key: "categories", label: "Categories" },
  { key: "featured", label: "Featured Products" },
  { key: "trending", label: "Trending Products" },
  { key: "why_choose_us", label: "Why Choose Us" },
  { key: "testimonials", label: "Testimonials" },
  { key: "newsletter", label: "Newsletter" },
];

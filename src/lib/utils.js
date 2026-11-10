import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function classNamesUtility(...inputs) {
  return twMerge(clsx(...inputs));
}

function formatPriceINRUtility(priceValue) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceValue);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function truncate(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SGD-${timestamp}-${random}`;
}

export { classNamesUtility as classNames, formatPriceINRUtility as formatPriceINR, formatDate, formatDateTime, slugify, truncate, generateOrderNumber };
export const formatPrice = formatPriceINRUtility;

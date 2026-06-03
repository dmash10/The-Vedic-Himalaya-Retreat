import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves or parses a Google Maps share link/address into an iframe-friendly embed URL.
 * Falls back to resort coordinates (Village Dewar, Guptkashi).
 */
export function getMapEmbedUrl(mapsUrl: string, address: string) {
  // If mapsUrl is already an embed URL, return it
  if (mapsUrl && (mapsUrl.includes('/embed') || mapsUrl.includes('output=embed'))) {
    return mapsUrl;
  }

  // Resolve known short URLs to exact coordinates for absolute precision
  if (mapsUrl && mapsUrl.includes('1Ec5QAh6RJano1BZ7')) {
    return 'https://maps.google.com/maps?q=30.528200,79.068041&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }

  // Extract coordinates (lat,lng) if present in URL
  const coordRegex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = mapsUrl ? mapsUrl.match(coordRegex) : null;
  if (match) {
    const lat = match[1];
    const lng = match[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Use the physical address query
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Default fallback (Vedic Himalaya Retreat, Village Dewar)
  return 'https://maps.google.com/maps?q=30.528200,79.068041&t=&z=15&ie=UTF8&iwloc=&output=embed';
}


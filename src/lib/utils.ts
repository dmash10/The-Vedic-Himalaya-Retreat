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
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.8142090316883!2d79.0675857!3d30.528566199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908373ec7f69455%3A0x6cfb243add26a3!2sThe%20Vedic%20Himalaya%20Retreat!5e1!3m2!1sen!2sin!4v1780983587789!5m2!1sen!2sin';
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

  // Default fallback (The Vedic Himalaya Retreat)
  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.8142090316883!2d79.0675857!3d30.528566199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908373ec7f69455%3A0x6cfb243add26a3!2sThe%20Vedic%20Himalaya%20Retreat!5e1!3m2!1sen!2sin!4v1780983587789!5m2!1sen!2sin';
}


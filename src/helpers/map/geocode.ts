import { loadGoogleMaps } from "../../utils";

const memoryCache = new Map<string, google.maps.LatLngLiteral>();
let geocoder: google.maps.Geocoder | null = null;

function storageKey(address: string) {
  return `geocode:${address.trim().toLowerCase()}`;
}

function readFromStorage(key: string): google.maps.LatLngLiteral | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as google.maps.LatLngLiteral) : null;
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: google.maps.LatLngLiteral) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (e.g. private mode) — memory cache still applies
  }
}

// Geocodes a postal address to lat/lng, caching results in memory and
// sessionStorage so repeated renders/navigations don't re-bill the Geocoding API.
export async function geocodeAddress(
  address: string,
): Promise<google.maps.LatLngLiteral | null> {
  const key = storageKey(address);

  if (memoryCache.has(key)) return memoryCache.get(key)!;

  const stored = readFromStorage(key);
  if (stored) {
    memoryCache.set(key, stored);
    return stored;
  }

  await loadGoogleMaps();
  geocoder ??= new google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({ address });
    const location = results[0]?.geometry?.location;
    if (!location) return null;

    const position = { lat: location.lat(), lng: location.lng() };
    memoryCache.set(key, position);
    writeToStorage(key, position);
    return position;
  } catch {
    return null;
  }
}

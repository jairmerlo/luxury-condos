type Loader<T> = () => Promise<T>;
const cache = new Map<string, Promise<unknown>>();

function lazyTool<T>(key: string, loader: Loader<T>): Promise<T> {
  if (cache.has(key)) return cache.get(key) as Promise<T>;
  const promise = loader();
  cache.set(key, promise);
  return promise;
}

export function loadGoogleMaps() {
  return lazyTool("google-maps", async () => {
    const apiKey = window.__flex_g_settings?.agent_info?.google_maps_api_key;
    const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
    setOptions({ key: apiKey, v: "weekly" });
    // Bootstraps window.google.maps and attaches the classes this app uses
    // (Map, InfoWindow, LatLngBounds, marker.AdvancedMarkerElement, Geocoder).
    await Promise.all([
      importLibrary("maps"),
      importLibrary("marker"),
      importLibrary("geocoding"),
    ]);
  });
}

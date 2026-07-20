interface MarkerClustererElementProps {
  names: string[];
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
}

export function MarkerClustererElement({
  names,
  position,
  AdvancedMarkerElement,
}: MarkerClustererElementProps) {
  const content = document.createElement("div");
  content.className = "map-view__cluster";
  content.innerHTML = names
    .map((name) => `<div class="map-view__cluster-name">${name}</div>`)
    .join("");

  return new AdvancedMarkerElement({ position, content });
}

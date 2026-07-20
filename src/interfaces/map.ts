import type { Building } from "./buildings";

export type MapStrategy = "immediate" | "idle" | "onInteraction";

export interface GeocodedBuilding extends Building {
  position: google.maps.LatLngLiteral;
}

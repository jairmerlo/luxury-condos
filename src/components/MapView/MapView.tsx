import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MapLoader } from "./MapLoader";
import { MapViewInfo } from "../MapViewInfo";
import type { Building, GetBuildingsResponse } from "../../interfaces/buildings";
import type { GeocodedBuilding } from "../../interfaces/map";
import "./MapView.css";
import { SideList } from "../SideList";

const slugify = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

interface MapViewProps {
  data?: GetBuildingsResponse;
  isLoading?: boolean;
  isError?: boolean;
}

// Aventura, FL — falls back here until markers are geocoded.
const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 25.9565, lng: -80.139 };
const DEFAULT_ZOOM = 13;

// Some buildings already include lat/lng from the API — use them directly
// instead of re-geocoding the address.
function toLatLng(
  lat: string | number | undefined,
  lng: string | number | undefined,
): google.maps.LatLngLiteral | null {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (lat === undefined || lng === undefined || Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
    return null;
  }
  return { lat: parsedLat, lng: parsedLng };
}

export const MapView = ({ data, isLoading = false, isError = false }: MapViewProps) => {
  const buildings = useMemo(() => data?.data.buildings ?? [], [data]);
  const [isListOpen, setIsListOpen] = useState(true);

  return (
    <div className="map-view">
      <button
        type="button"
        className="map-view__toggle"
        onClick={() => setIsListOpen((open) => !open)}
      >
        {isListOpen ? "Close" : "Open"}
      </button>
      <div className="map-view__map-panel">
        {isError ? (
          <p className="map-view__message">Failed to load buildings.</p>
        ) : (
          <MapLoader>
            <MapCanvas buildings={buildings} isLoading={isLoading} />
          </MapLoader>
        )}
      </div>
      <SideList
        data={data}
        isLoading={isLoading}
        isError={isError}
        className={isListOpen ? undefined : "side-list--hidden"}
      />
    </div>
  );
};

interface MapCanvasProps {
  buildings: Building[];
  isLoading: boolean;
}

const MapCanvas = ({ buildings, isLoading }: MapCanvasProps) => {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const infoContainerRef = useRef<HTMLDivElement | null>(null);
  const infoRootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!mapNodeRef.current || map) return;

    const newMap = new google.maps.Map(mapNodeRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      mapId: "LUXURY_CONDOS_MAP",
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      minZoom: 3,
    });

    infoWindowRef.current = new google.maps.InfoWindow();
    setMap(newMap);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    let cancelled = false;

    (async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      const geocoded = buildings
        .map((building): GeocodedBuilding | null => {
          const position = toLatLng(building.lat, building.lng);
          return position ? { ...building, position } : null;
        })
        .filter((building): building is GeocodedBuilding => building !== null);

      if (cancelled) return;

      markersRef.current.forEach((marker) => (marker.map = null));

      markersRef.current = geocoded.map((building) => {
        const pin = document.createElement("div");
        pin.className = "map-view__pin";
        pin.textContent = building.name;

        const marker = new AdvancedMarkerElement({
          map,
          position: building.position,
          content: pin,
          title: building.name,
        });

        marker.addListener("click", () => {
          const infoWindow = infoWindowRef.current;
          if (!infoWindow) return;

          if (!infoContainerRef.current) {
            infoContainerRef.current = document.createElement("div");
            infoRootRef.current = createRoot(infoContainerRef.current);
          }

          infoRootRef.current?.render(
            <MapViewInfo
              title={building.neighborhood}
              buildingName={building.name}
              address={building.address}
              unitBuilding={Number(building.unitBuilding)}
              year={Number(building.year)}
              url={`/building/${slugify(building.name)}`}
              onClose={() => infoWindow.close()}
            />,
          );

          infoWindow.setContent(infoContainerRef.current);
          infoWindow.open({ map, anchor: marker });
        });

        return marker;
      });

      if (geocoded.length === 1) {
        map.setCenter(geocoded[0].position);
        map.setZoom(15);
      } else if (geocoded.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        geocoded.forEach((building) => bounds.extend(building.position));
        map.fitBounds(bounds);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [map, buildings]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => (marker.map = null));
      infoWindowRef.current?.close();
      infoRootRef.current?.unmount();
    };
  }, []);

  return (
    <div className="map-view__wrapper">
      {isLoading && <div className="map-view__loading">Loading buildings…</div>}
      <div ref={mapNodeRef} className="map-view__canvas" />
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from "react";
import { MarkerUtils, type MarkerClusterer as MarkerClustererType } from "@googlemaps/markerclusterer";
import { MapLoader } from "./MapLoader";
import { MarkerClustererElement } from "../../helpers/map";
import { loadMarkerClusterer } from "../../utils";
import type { Building, GetBuildingsResponse } from "../../interfaces/buildings";
import type { GeocodedBuilding } from "../../interfaces/map";
import "./MapView.css";
import { SideList } from "../SideList";

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
  const clustererRef = useRef<MarkerClustererType | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

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
      const [{ AdvancedMarkerElement }, { MarkerClusterer }] = await Promise.all([
        google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
        loadMarkerClusterer(),
      ]);

      const geocoded = buildings
        .map((building): GeocodedBuilding | null => {
          const position = toLatLng(building.lat, building.lng);
          return position ? { ...building, position } : null;
        })
        .filter((building): building is GeocodedBuilding => building !== null);

      if (cancelled) return;

      const markers = geocoded.map((building) => {
        const pin = document.createElement("div");
        pin.className = "map-view__pin";
        pin.textContent = building.name;

        const marker = new AdvancedMarkerElement({
          position: building.position,
          content: pin,
          title: building.name,
        });

        marker.addListener("click", () => {
          if (!infoWindowRef.current) return;
          infoWindowRef.current.setContent(`
            <div class="map-view__info">
              <strong>${building.name}</strong>
              <p>${building.address}</p>
              <p>${building.beds} units · ${building.floors} floors · ${building.year}</p>
            </div>
          `);
          infoWindowRef.current.open({ map, anchor: marker });
        });

        return marker;
      });

      clustererRef.current?.setMap(null);
      clustererRef.current = new MarkerClusterer({
        map,
        markers,
        renderer: {
          render: ({ markers: clusterMarkers, position }) =>
            MarkerClustererElement({
              names: clusterMarkers
                .filter(MarkerUtils.isAdvancedMarker)
                .map((marker) => marker.title)
                .filter((title): title is string => Boolean(title)),
              position,
              AdvancedMarkerElement,
            }),
        },
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
      clustererRef.current?.setMap(null);
      infoWindowRef.current?.close();
    };
  }, []);

  return (
    <div className="map-view__wrapper">
      {isLoading && <div className="map-view__loading">Loading buildings…</div>}
      <div ref={mapNodeRef} className="map-view__canvas" />
    </div>
  );
};

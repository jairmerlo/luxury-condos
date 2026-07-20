import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isPerfBot, loadGoogleMaps } from "../../utils";
import type { MapStrategy } from "../../interfaces/map";

interface MapLoaderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const MapLoader = ({ children, enabled = true }: MapLoaderProps) => {
  const [strategy] = useState<MapStrategy>(() =>
    isPerfBot() ? "onInteraction" : "idle",
  );

  const [ready, setReady] = useState(false);
  const [asked, setAsked] = useState(strategy !== "onInteraction");

  const isOnInteraction = strategy === "onInteraction";

  useEffect(() => {
    if (!enabled || !isOnInteraction || asked) return;

    const trigger = () => setAsked(true);
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "touchstart",
      "keydown",
      "wheel",
      "scroll",
      "pointerover",
    ];
    const opts: AddEventListenerOptions = { passive: true, once: true };
    events.forEach((event) => window.addEventListener(event, trigger, opts));

    return () => {
      events.forEach((event) => window.removeEventListener(event, trigger));
    };
  }, [enabled, isOnInteraction, asked]);

  useEffect(() => {
    if (!enabled) return;
    if (isOnInteraction && !asked) return;

    let cancelled = false;
    const start = () =>
      loadGoogleMaps().then(() => !cancelled && setReady(true));

    if (strategy === "immediate") {
      start();
    } else if (strategy === "idle") {
      if ("requestIdleCallback" in window) {
        (
          window as unknown as {
            requestIdleCallback: (cb: () => void) => void;
          }
        ).requestIdleCallback(start);
      } else {
        setTimeout(start, 0);
      }
    } else {
      start();
    }

    return () => {
      cancelled = true;
    };
  }, [enabled, isOnInteraction, strategy, asked]);

  if (!enabled) return null;

  if (!ready) {
    return (
      <div className="map-view__placeholder">
        {!isOnInteraction && <div className="map-view__placeholder-icon" />}
      </div>
    );
  }

  return <>{children}</>;
};

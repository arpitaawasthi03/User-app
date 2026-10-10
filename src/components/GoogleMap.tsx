import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import {
  DARK_MAP_STYLE,
  DEFAULT_CENTER,
  PRESET_COORDS,
  loadGoogleMaps,
  type LatLng,
} from "../lib/googleMaps";

interface GoogleMapProps {
  origin?: LatLng;
  destination?: LatLng;
  driver?: LatLng;
  etaText?: string;
  etaUnit?: string;
  className?: string;
  interactive?: boolean;
  theme?: "dark" | "light";
  style?: React.CSSProperties;
  showRoute?: boolean;
  zoom?: number;
}

export default function GoogleMap({
  origin = PRESET_COORDS.home,
  destination = PRESET_COORDS.work,
  driver = PRESET_COORDS.driver,
  etaText = "5 min",
  etaUnit = "away",
  className = "",
  interactive = true,
  theme = "dark",
  style,
  showRoute = true,
  zoom = 14,
}: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(() => {
    return (
      localStorage.getItem("roadrider_google_maps_key") ||
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      ""
    );
  });

  // Attempt to load Google Maps API
  useEffect(() => {
    let mounted = true;
    if (activeKey) {
      loadGoogleMaps(activeKey).then((success) => {
        if (mounted && success) {
          setMapsLoaded(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [activeKey]);

  // Initialize and update real Google Map when API is loaded
  useEffect(() => {
    if (!mapsLoaded || !mapContainerRef.current || !window.google?.maps) return;

    try {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: origin,
        zoom,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: theme === "dark" ? DARK_MAP_STYLE : undefined,
      });

      mapInstanceRef.current = map;

      // Pickup / Origin Marker
      new google.maps.Marker({
        position: origin,
        map,
        title: origin.label || "Pickup Point",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#28a745",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
      });

      // Destination Marker
      new google.maps.Marker({
        position: destination,
        map,
        title: destination.label || "Destination",
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#e05a0f",
          fillOpacity: 1,
          strokeWeight: 1.5,
          strokeColor: "#ffffff",
          scale: 1.6,
          anchor: new google.maps.Point(12, 22),
        },
      });

      // Driver Marker
      if (driver) {
        new google.maps.Marker({
          position: driver,
          map,
          title: driver.label || "Driver",
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: "#ff9900",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            rotation: 45,
          },
        });
      }

      // Directions or Polyline Route
      if (showRoute) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#e05a0f",
            strokeOpacity: 0.9,
            strokeWeight: 4,
          },
        });

        directionsService.route(
          {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (
            result: google.maps.DirectionsResult | null,
            status: string
          ) => {
            if (status === "OK" && result) {
              directionsRenderer.setDirections(result);
            } else {
              // Fallback polyline between points
              new google.maps.Polyline({
                path: [origin, driver || origin, destination],
                geodesic: true,
                strokeColor: "#e05a0f",
                strokeOpacity: 0.85,
                strokeWeight: 4,
                map,
              });
            }
          }
        );
      }

      // Fit map bounds to show both origin & destination
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      if (driver) bounds.extend(driver);
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } catch (e) {
      console.error("Error initializing Google Map:", e);
    }
  }, [mapsLoaded, origin, destination, driver, showRoute, theme, zoom, interactive]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("roadrider_google_maps_key", apiKeyInput.trim());
      setActiveKey(apiKeyInput.trim());
      setShowKeyModal(false);
    }
  };

  return (
    <div
      className={`map-art google-map-wrapper ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#161c24",
        ...style,
      }}
    >
      {mapsLoaded ? (
        /* Real Interactive Google Map instance */
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />
      ) : (
        /* Interactive Vector Map Preview (Lucknow Coordinates) */
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg
            viewBox="0 0 340 220"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              className="road"
              d="M-10 45C55 25 80 96 142 70S240 18 355 48M-5 170c70-40 97-6 151-30s90-77 205-55M75-5c5 50-27 102 5 230M255-5c-30 70 20 135-10 230"
            />
            <path
              className="minor"
              d="M25-5v230M130-5c-10 80 15 135-5 230M310-5v230M-5 110h350M-5 200h350"
            />
            <path
              className="route"
              d="M65 175c30-30 48-18 70-52 20-31 37-16 62-38 25-21 42-13 73-44"
            />
          </svg>

          {/* Interactive Coordinates Overlay */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 3,
              background: "rgba(13, 27, 44, 0.75)",
              backdropFilter: "blur(6px)",
              padding: "4px 8px",
              borderRadius: 8,
              fontSize: 8.5,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 8 }}>●</span>
            <span>
              {origin.lat.toFixed(4)}° N, {origin.lng.toFixed(4)}° E
            </span>
          </div>

          <span className="map-pin start">
            <i />
          </span>
          <span className="map-pin end">
            <Icon name="pin" size={16} />
          </span>
        </div>
      )}

      {/* Floating ETA bubble */}
      <div className="eta-bubble" style={{ zIndex: 4 }}>
        <b>{etaText}</b>
        <small>{etaUnit}</small>
      </div>

      {/* Google Maps Configuration Pill */}
      <button
        type="button"
        onClick={() => setShowKeyModal(true)}
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          zIndex: 5,
          background: mapsLoaded ? "rgba(34, 197, 94, 0.9)" : "rgba(13, 27, 44, 0.85)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20,
          padding: "5px 10px",
          fontSize: 9,
          fontWeight: 700,
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          gap: 5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
        aria-label="Google Maps Settings"
      >
        <span style={{ fontSize: 10 }}>{mapsLoaded ? "🗺️" : "⚙️"}</span>
        <span>{mapsLoaded ? "Google Maps Live" : "Configure Maps Key"}</span>
      </button>

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 15, 25, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div
            style={{
              background: "#1e2633",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: 18,
              width: "100%",
              maxWidth: 320,
              color: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>🗺️</span>
                <strong style={{ fontSize: 13 }}>Google Maps Credentials</strong>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#aaa",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
            <p
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 12px",
                lineHeight: 1.4,
              }}
            >
              Paste your Google Maps JavaScript API Key below to activate live satellite,
              road tiles, and real-time route rendering.
            </p>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#111722",
                color: "#fff",
                fontSize: 11,
                boxSizing: "border-box",
                marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleSaveApiKey}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save & Load Map
              </button>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#ccc",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

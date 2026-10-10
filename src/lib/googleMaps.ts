/**
 * Google Maps integration helpers, loaders, and coordinates.
 */

export interface LatLng {
  lat: number;
  lng: number;
  label?: string;
}

// Known coordinates for RoadRider seed locations in Lucknow, India
export const PRESET_COORDS: Record<string, LatLng> = {
  home: { lat: 26.8467, lng: 80.9462, label: "Home (Hazratganj)" },
  work: { lat: 26.8665, lng: 81.0063, label: "Work (Gomti Nagar)" },
  aminabad: { lat: 26.8437, lng: 80.9262, label: "Aminabad" },
  driver: { lat: 26.8540, lng: 80.9680, label: "RoadRider Driver" },
  restaurant: { lat: 26.8512, lng: 80.9490, label: "Royal Biryani House" },
};

export const DEFAULT_CENTER: LatLng = PRESET_COORDS.home;

// Dark night mode style for RoadRider maps
export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#171c26" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#171c26" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a96a3" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d69a7c" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a96a3" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e2c24" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9c7d" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#283344" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c2533" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca7b5" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#d96526" }, { weight: 1.5 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#87380f" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f7d5c3" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#111823" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
];

let loadScriptPromise: Promise<boolean> | null = null;

/**
 * Loads the Google Maps JavaScript API asynchronously.
 */
export function loadGoogleMaps(apiKey?: string): Promise<boolean> {
  const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve(true);
  }

  if (!key) {
    return Promise.resolve(false);
  }

  if (loadScriptPromise) {
    return loadScriptPromise;
  }

  loadScriptPromise = new Promise((resolve) => {
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.warn("Failed to load Google Maps JavaScript API with provided key.");
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return loadScriptPromise;
}

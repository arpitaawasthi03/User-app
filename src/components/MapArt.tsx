import GoogleMap, { type EtaResult } from "./GoogleMap";
import type { LatLng } from "../lib/googleMaps";

interface MapArtProps {
  origin?: LatLng;
  destination?: LatLng;
  driver?: LatLng;
  etaText?: string;
  etaUnit?: string;
  className?: string;
  onEtaCalculated?: (eta: EtaResult) => void;
}

export default function MapArt({
  origin,
  destination,
  driver,
  etaText = "15 min",
  etaUnit = "away",
  className = "",
  onEtaCalculated,
}: MapArtProps) {
  return (
    <GoogleMap
      origin={origin}
      destination={destination}
      driver={driver}
      etaText={etaText}
      etaUnit={etaUnit}
      className={className}
      showRoute
      onEtaCalculated={onEtaCalculated}
    />
  );
}

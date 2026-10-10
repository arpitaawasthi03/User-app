import GoogleMap from "./GoogleMap";

interface MapArtProps {
  etaText?: string;
  etaUnit?: string;
  className?: string;
}

export default function MapArt({
  etaText = "5 min",
  etaUnit = "away",
  className = "",
}: MapArtProps) {
  return (
    <GoogleMap
      etaText={etaText}
      etaUnit={etaUnit}
      className={className}
      showRoute
    />
  );
}

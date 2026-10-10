import Icon from "./Icon";

interface MapArtProps {
  etaText?: string;
  etaUnit?: string;
  className?: string;
}

export default function MapArt({ etaText = "5 min", etaUnit = "away", className = "" }: MapArtProps) {
  return (
    <div className={`map-art ${className}`}>
      <svg viewBox="0 0 340 220" preserveAspectRatio="none" aria-hidden="true">
        <path className="road" d="M-10 45C55 25 80 96 142 70S240 18 355 48M-5 170c70-40 97-6 151-30s90-77 205-55M75-5c5 50-27 102 5 230M255-5c-30 70 20 135-10 230" />
        <path className="minor" d="M25-5v230M130-5c-10 80 15 135-5 230M310-5v230M-5 110h350M-5 200h350" />
        <path className="route" d="M65 175c30-30 48-18 70-52 20-31 37-16 62-38 25-21 42-13 73-44" />
      </svg>
      <span className="map-pin start"><i /></span>
      <span className="map-pin end"><Icon name="pin" size={16} /></span>
      <div className="eta-bubble">
        <b>{etaText}</b>
        <small>{etaUnit}</small>
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "../../components/Header";
import ServiceTabs from "../../components/ServiceTabs";
import MapArt from "../../components/MapArt";
import LocationRows from "../../components/LocationRows";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { RIDE_OPTIONS, type Service } from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function RidesHome() {
  const { push } = useNav();
  const { setService, state, setRide, placeById, showToast } = useApp();
  const [segment, setSegment] = useState<"book" | "rental">("book");

  const selectedOption =
    RIDE_OPTIONS.find((r) => r.id === state.ride.optionId) ?? RIDE_OPTIONS[1];

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const handleSelectRide = (id: string) => {
    setRide({ optionId: id });
  };

  const handleBook = () => {
    if (segment === "rental") {
      showToast("Hourly rental packages are launching soon in Lucknow.");
      return;
    }
    if (!state.ride.dropId) {
      showToast("Please choose your destination first.");
      push({ name: "places", mode: "rideDrop" });
      return;
    }
    push({ name: "rideConfirm" });
  };

  const dropPlace = placeById(state.ride.dropId);

  return (
    <div className="rides-page">
      <Header dark />
      <ServiceTabs service="rides" onSelect={handleSelectService} />

      <div className="segment">
        <button
          type="button"
          className={segment === "book" ? "selected" : ""}
          onClick={() => setSegment("book")}
        >
          Book a ride
        </button>
        <button
          type="button"
          className={segment === "rental" ? "selected" : ""}
          onClick={() => {
            setSegment("rental");
            showToast("Hourly packages: 2 hrs (20 km), 4 hrs (40 km). Select a ride to preview.");
          }}
        >
          Hourly rental
        </button>
      </div>

      <MapArt
        etaText={selectedOption.eta}
        etaUnit={dropPlace ? "to arrival" : "away"}
      />

      <LocationRows />

      <div className="section-heading">
        <h2>{segment === "rental" ? "Rental packages" : "Choose a ride"}</h2>
        <span>Fare estimate</span>
      </div>

      <div className="ride-options">
        {RIDE_OPTIONS.map((opt) => {
          const isSelected = opt.id === selectedOption.id;
          return (
            <button
              key={opt.name}
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => handleSelectRide(opt.id)}
            >
              <span className="vehicle">{opt.abbr}</span>
              <strong>{opt.name}</strong>
              <b>{opt.range}</b>
              <small>{opt.eta}</small>
            </button>
          );
        })}
      </div>

      <Button onClick={handleBook}>
        {`Book ${selectedOption.name} · ${selectedOption.range}`}{" "}
        <Icon name="arrow" size={19} />
      </Button>
    </div>
  );
}

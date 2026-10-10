import { useState } from "react";
import Header from "../../components/Header";
import ServiceTabs from "../../components/ServiceTabs";
import MapArt from "../../components/MapArt";
import LocationRows from "../../components/LocationRows";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { RIDE_OPTIONS, RENTAL_PACKAGES, type Service } from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function RidesHome() {
  const { push } = useNav();
  const { setService, state, setRide, placeById, showToast } = useApp();
  const [segment, setSegment] = useState<"book" | "rental">("book");
  const [selectedPackageId, setSelectedPackageId] = useState("pkg-2h");

  const selectedOption =
    RIDE_OPTIONS.find((r) => r.id === state.ride.optionId) ?? RIDE_OPTIONS[1];
  const selectedRental =
    RENTAL_PACKAGES.find((p) => p.id === selectedPackageId) ?? RENTAL_PACKAGES[0];

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const handleSelectRide = (id: string) => {
    setRide({ optionId: id });
  };

  const handleBook = () => {
    if (segment === "rental") {
      if (!state.ride.dropId) {
        setRide({ dropId: state.ride.pickupId ?? "home" });
      }
      showToast(`${selectedRental.name} selected. Confirm your rental booking.`);
      push({ name: "rideConfirm" });
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
          onClick={() => setSegment("rental")}
        >
          Hourly rental
        </button>
      </div>

      <MapArt
        etaText={selectedOption.eta}
        etaUnit={dropPlace ? "to arrival" : "away"}
      />

      <LocationRows />

      {segment === "rental" ? (
        <div style={{ margin: "16px 0 12px" }}>
          <div className="section-heading" style={{ margin: "0 0 10px" }}>
            <h2>Select package duration</h2>
            <span>Multiple stops included</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {RENTAL_PACKAGES.map((pkg) => {
              const isSel = pkg.id === selectedPackageId;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackageId(pkg.id)}
                  style={{
                    padding: "10px 6px",
                    borderRadius: 14,
                    background: isSel ? "var(--accent-soft)" : "#ffffff",
                    border: isSel ? "2px solid var(--accent)" : "1px solid var(--line)",
                    color: isSel ? "var(--accent)" : "var(--ink)",
                    display: "grid",
                    placeItems: "center",
                    gap: 3,
                  }}
                >
                  <strong style={{ fontSize: 11 }}>{pkg.hours} Hours</strong>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>{pkg.km} km</span>
                  <b style={{ fontSize: 12, marginTop: 4 }}>{rupees(pkg.fare)}</b>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="section-heading">
        <h2>{segment === "rental" ? "Choose vehicle" : "Choose a ride"}</h2>
        <span>Fare estimate</span>
      </div>

      <div className="ride-options">
        {RIDE_OPTIONS.map((opt) => {
          const isSelected = opt.id === selectedOption.id;
          const displayFare =
            segment === "rental"
              ? opt.id === "bike"
                ? rupees(Math.round(selectedRental.fare * 0.6))
                : opt.id === "auto"
                ? rupees(selectedRental.fare)
                : opt.id === "cab"
                ? rupees(Math.round(selectedRental.fare * 1.5))
                : rupees(Math.round(selectedRental.fare * 2.1))
              : opt.range;

          return (
            <button
              key={opt.name}
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => handleSelectRide(opt.id)}
            >
              <span className="vehicle">{opt.abbr}</span>
              <strong>{opt.name}</strong>
              <b>{displayFare}</b>
              <small>{opt.eta}</small>
            </button>
          );
        })}
      </div>

      <Button onClick={handleBook}>
        {segment === "rental"
          ? `Book ${selectedOption.name} · ${selectedRental.name}`
          : `Book ${selectedOption.name} · ${selectedOption.range}`}{" "}
        <Icon name="arrow" size={19} />
      </Button>
    </div>
  );
}

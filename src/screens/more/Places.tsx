import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { PlacesMode } from "../../navigation/Navigation";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface PlacesProps {
  mode: PlacesMode;
}

export default function Places({ mode }: PlacesProps) {
  const { back, push } = useNav();
  const { state, setDefaultPlace, setRide, setCourier, removePlace, showToast } = useApp();

  const handleSelectPlace = (placeId: string) => {
    switch (mode) {
      case "delivery":
        setDefaultPlace(placeId);
        showToast("Delivery address updated");
        back();
        break;
      case "ridePickup":
        setRide({ pickupId: placeId });
        showToast("Pickup location set");
        back();
        break;
      case "rideDrop":
        setRide({ dropId: placeId });
        showToast("Destination set");
        back();
        break;
      case "courierPickup":
        setCourier({ pickupId: placeId });
        showToast("Courier pickup set");
        back();
        break;
      case "courierDrop":
        setCourier({ dropId: placeId });
        showToast("Courier drop-off set");
        back();
        break;
      case "manage":
        setDefaultPlace(placeId);
        showToast("Default address updated");
        break;
    }
  };

  const getActiveId = () => {
    switch (mode) {
      case "delivery":
      case "manage":
        return state.defaultPlaceId;
      case "ridePickup":
        return state.ride.pickupId;
      case "rideDrop":
        return state.ride.dropId;
      case "courierPickup":
        return state.courier.pickupId;
      case "courierDrop":
        return state.courier.dropId;
    }
  };

  const activeId = getActiveId();

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="pin" size={28} />
        </span>
        <p>SAVED PLACES</p>
        <h1>
          {mode === "manage"
            ? "Saved addresses"
            : mode.includes("Pickup")
            ? "Choose pickup location"
            : "Choose destination"}
        </h1>
        <p>Use a saved place or add a new address for faster checkout.</p>
      </div>

      <div className="more-list">
        {state.places.map((place) => {
          const isSelected = place.id === activeId;
          return (
            <button
              key={place.id}
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => handleSelectPlace(place.id)}
            >
              <span>
                <Icon name={place.icon} size={15} />
              </span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 11, display: "block" }}>{place.label}</strong>
                <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
                  {place.line}
                </small>
              </div>
              {mode === "manage" && state.places.length > 1 ? (
                <span
                  style={{ background: "transparent", color: "var(--muted)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlace(place.id);
                    showToast(`Removed ${place.label}`);
                  }}
                  aria-label={`Remove ${place.label}`}
                >
                  <Icon name="trash" size={16} />
                </span>
              ) : (
                <Icon name={isSelected ? "check" : "arrow"} size={17} />
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => push({ name: "addAddress", mode })}
          style={{ background: "#fbf9f6" }}
        >
          <span>
            <Icon name="plus" size={15} />
          </span>
          <strong>Add a new address</strong>
          <Icon name="arrow" size={17} />
        </button>
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

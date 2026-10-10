import Icon from "./Icon";
import { useApp } from "../state/AppState";
import { useNav } from "../navigation/Navigation";

interface LocationRowsProps {
  courier?: boolean;
  onPickupClick?: () => void;
  onDropClick?: () => void;
}

export default function LocationRows({ courier = false, onPickupClick, onDropClick }: LocationRowsProps) {
  const { state, placeById } = useApp();
  const { push } = useNav();

  const pickupPlaceId = courier ? state.courier.pickupId : state.ride.pickupId;
  const dropPlaceId = courier ? state.courier.dropId : state.ride.dropId;

  const pickupPlace = placeById(pickupPlaceId) ?? state.places[0];
  const dropPlace = placeById(dropPlaceId);

  const handlePickup = () => {
    if (onPickupClick) return onPickupClick();
    push({ name: "places", mode: courier ? "courierPickup" : "ridePickup" });
  };

  const handleDrop = () => {
    if (onDropClick) return onDropClick();
    push({ name: "places", mode: courier ? "courierDrop" : "rideDrop" });
  };

  return (
    <div className="location-rows">
      <button type="button" onClick={handlePickup}>
        <span className="loc-dot green" />
        <div>
          <small>{courier ? "PICKUP LOCATION" : "PICKUP"}</small>
          <strong>{pickupPlace ? `${pickupPlace.label}, ${pickupPlace.area.split(",")[0]}` : "Select pickup"}</strong>
        </div>
        <Icon name="arrow" size={17} />
      </button>

      <button type="button" onClick={handleDrop}>
        <span className="loc-dot orange" />
        <div>
          <small>{courier ? "DELIVERY LOCATION" : "DESTINATION"}</small>
          <strong>
            {dropPlace
              ? `${dropPlace.label}, ${dropPlace.area.split(",")[0]}`
              : courier
              ? "Add delivery address"
              : "Where to?"}
          </strong>
        </div>
        <Icon name="arrow" size={17} />
      </button>
    </div>
  );
}

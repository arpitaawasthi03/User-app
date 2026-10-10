import FlowHeader from "../../components/FlowHeader";
import MapArt from "../../components/MapArt";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { Service } from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface DeliveryDetailsProps {
  service: Service;
}

export default function DeliveryDetails({ service }: DeliveryDetailsProps) {
  const { push } = useNav();
  const { state, setDefaultPlace, showToast } = useApp();

  const handleSelectPlace = (id: string) => {
    setDefaultPlace(id);
  };

  const handleDeliverHere = () => {
    if (!state.defaultPlaceId && state.places.length === 0) {
      showToast("Please add a delivery address.");
      push({ name: "addAddress", mode: "delivery" });
      return;
    }
    push({ name: "payment", service });
  };

  return (
    <div className="flow-page checkout">
      <FlowHeader title="Delivery details" />

      <div className="map-mini">
        <MapArt />
      </div>

      <div className="section-heading">
        <h2>Choose an address</h2>
        <button
          type="button"
          onClick={() => push({ name: "addAddress", mode: "delivery" })}
        >
          + Add new
        </button>
      </div>

      {state.places.map((place) => {
        const isSelected = place.id === state.defaultPlaceId;
        return (
          <button
            key={place.id}
            type="button"
            className={`address-card ${isSelected ? "selected" : ""}`}
            onClick={() => handleSelectPlace(place.id)}
          >
            <span>
              <Icon name={place.icon} />
            </span>
            <div>
              <strong>{place.label}</strong>
              <p>{place.line}</p>
            </div>
            <i />
          </button>
        );
      })}

      <div className="bottom-action">
        <Button onClick={handleDeliverHere}>
          Deliver here
        </Button>
      </div>
    </div>
  );
}

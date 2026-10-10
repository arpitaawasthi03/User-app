import FlowHeader from "../../components/FlowHeader";
import MapArt from "../../components/MapArt";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { RESTAURANTS, GROCERY_HUB, type Service } from "../../data/demo";
import { PRESET_COORDS } from "../../lib/googleMaps";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface DeliveryDetailsProps {
  service: Service;
}

export default function DeliveryDetails({ service }: DeliveryDetailsProps) {
  const { push } = useNav();
  const { state, setDefaultPlace, showToast } = useApp();

  const currentCart = service === "food" || service === "grocery" ? state.carts[service] : null;
  const store = service === "food"
    ? RESTAURANTS.find((r) => r.id === currentCart?.storeId) || RESTAURANTS[0]
    : service === "grocery"
    ? GROCERY_HUB
    : null;

  const currentPlace = state.places.find((p) => p.id === state.defaultPlaceId) ?? state.places[0];
  const originCoords = store ? { ...store.coords, label: store.name } : PRESET_COORDS.restaurant;
  const destCoords = currentPlace?.coords ? { ...currentPlace.coords, label: currentPlace.label } : PRESET_COORDS.home;

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
        <MapArt
          origin={originCoords}
          destination={destCoords}
          etaText={service === "food" && "etaShort" in (store || {}) ? (store as any).etaShort : "20 min"}
        />
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

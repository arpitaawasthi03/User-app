import FlowHeader from "../../components/FlowHeader";
import MapArt from "../../components/MapArt";
import LocationRows from "../../components/LocationRows";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { RIDE_OPTIONS } from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function RideConfirm() {
  const { push } = useNav();
  const { state } = useApp();

  const opt =
    RIDE_OPTIONS.find((r) => r.id === state.ride.optionId) ?? RIDE_OPTIONS[1];

  return (
    <div className="flow-page themed">
      <FlowHeader title="Confirm booking" />
      <MapArt etaText={opt.eta} etaUnit="arrival" />

      <div className="driver-preview">
        <span className="vehicle-icon">
          <Icon name="car" />
        </span>
        <div>
          <small>YOUR RIDE</small>
          <h2>{opt.name}</h2>
          <p>{opt.tagline}</p>
        </div>
        <strong>{rupees(opt.fare)}</strong>
      </div>

      <LocationRows />

      <div className="info-strip">
        <Icon name="clock" />
        <span>
          Driver arrives in <strong>{opt.eta}</strong>
        </span>
      </div>

      <div className="bottom-action">
        <div
          className="pay-row"
          onClick={() => push({ name: "paymentMethods" })}
          style={{ cursor: "pointer" }}
        >
          <Icon name="card" />
          <span>RoadRider Wallet</span>
          <b>{rupees(state.wallet.balance)}</b>
          <Icon name="arrow" size={16} />
        </div>
        <Button onClick={() => push({ name: "cart", service: "rides" })}>
          Confirm {opt.name} · {rupees(opt.fare)}
        </Button>
      </div>
    </div>
  );
}

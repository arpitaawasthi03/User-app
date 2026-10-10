import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function PaymentMethods() {
  const { back, push } = useNav();
  const { state, showToast } = useApp();

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="card" size={28} />
        </span>
        <p>SAFE & SECURE</p>
        <h1>Payment methods</h1>
        <p>Manage the ways you pay across RoadRider.</p>
      </div>

      <div className="more-list">
        <button
          type="button"
          onClick={() => push({ name: "addMoney" })}
        >
          <span>
            <Icon name="wallet" size={15} />
          </span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 11, display: "block" }}>RoadRider Wallet</strong>
            <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
              Balance {rupees(state.wallet.balance)}
            </small>
          </div>
          <Icon name="arrow" size={17} />
        </button>

        <button
          type="button"
          onClick={() => showToast("Visa ending in 4821 is linked as default card.")}
        >
          <span>
            <Icon name="card" size={15} />
          </span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 11, display: "block" }}>Visa ending in 4821</strong>
            <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
              Primary payment card · Exp 08/29
            </small>
          </div>
          <Icon name="check" size={16} />
        </button>

        <button
          type="button"
          onClick={() => push({ name: "addPaymentMethod" })}
          style={{ background: "#fbf9f6" }}
        >
          <span>
            <Icon name="plus" size={15} />
          </span>
          <strong>Add UPI or a new card</strong>
          <Icon name="arrow" size={17} />
        </button>
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

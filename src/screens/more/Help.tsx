import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface HelpProps {
  orderId?: string;
}

export default function Help({ orderId }: HelpProps) {
  const { back, push } = useNav();
  const { showToast } = useApp();

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="shield" size={28} />
        </span>
        <p>24/7 SUPPORT</p>
        <h1>How can we help?</h1>
        <p>
          {orderId
            ? `Get quick assistance for your active order (${orderId}).`
            : "Get quick help with an order, payment, ride, or delivery."}
        </p>
      </div>

      <div className="more-list">
        <button
          type="button"
          onClick={() => push({ name: "chatSupport", orderId })}
        >
          <span>
            <Icon name="user" size={15} />
          </span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 11, display: "block" }}>Chat with support</strong>
            <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
              Typical response time: under 2 minutes
            </small>
          </div>
          <Icon name="arrow" size={17} />
        </button>

        <button
          type="button"
          onClick={() => showToast("Ticket created: Our team will review your order details.")}
        >
          <span>
            <Icon name="list" size={15} />
          </span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 11, display: "block" }}>Report an order issue</strong>
            <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
              Missing items, late delivery, or billing questions
            </small>
          </div>
          <Icon name="arrow" size={17} />
        </button>

        <button
          type="button"
          onClick={() => showToast("Emergency Safety Line: Call 1800-ROADRIDER or Police at 112.")}
        >
          <span>
            <Icon name="phone" size={15} />
          </span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 11, display: "block" }}>Safety & emergency help</strong>
            <small style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
              24x7 SOS and incident support
            </small>
          </div>
          <Icon name="arrow" size={17} />
        </button>
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

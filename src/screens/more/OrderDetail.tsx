import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BillSummary from "../../components/BillSummary";
import { formatWhen } from "../../lib/format";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { back, push } = useNav();
  const { state, showToast } = useApp();

  const order = state.orders.find((o) => o.id === orderId) ?? state.orders[0];
  const isActive = order?.status < 3;

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="list" size={28} />
        </span>
        <p>ORDER DETAILS</p>
        <h1>{order?.title ?? "Order summary"}</h1>
        <p>
          Order #{order?.id} · {order ? formatWhen(order.createdAt) : "Today"}
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 17,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <strong style={{ fontSize: 12 }}>Delivery Address</strong>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
              background: isActive ? "var(--accent-soft)" : "#e5f3e8",
              color: isActive ? "var(--accent)" : "#288153",
            }}
          >
            {isActive ? "ACTIVE" : "COMPLETED"}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
          {order?.destination}
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 17,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <strong style={{ fontSize: 12, display: "block", marginBottom: 10 }}>
          Items in this order
        </strong>
        {order?.lines.map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              padding: "6px 0",
              borderTop: i > 0 ? "1px solid var(--line)" : "none",
            }}
          >
            <span>
              {l.qty}x {l.name}
            </span>
            <strong>{rupees(l.price * l.qty)}</strong>
          </div>
        ))}
      </div>

      {order && <BillSummary service={order.service} billOverride={order.bill} />}

      <div className="more-list" style={{ marginTop: 14 }}>
        {isActive && (
          <button
            type="button"
            onClick={() => push({ name: "status", orderId: order.id, view: "tracking" })}
          >
            <span>
              <Icon name="pin" size={15} />
            </span>
            <strong>View live tracking</strong>
            <Icon name="arrow" size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={() => showToast(`Invoice #${order?.id}.pdf downloaded to your device`)}
        >
          <span>
            <Icon name="card" size={15} />
          </span>
          <strong>Download invoice</strong>
          <Icon name="arrow" size={17} />
        </button>

        <button
          type="button"
          onClick={() => push({ name: "help", orderId: order?.id })}
        >
          <span>
            <Icon name="shield" size={15} />
          </span>
          <strong>Get help with this order</strong>
          <Icon name="arrow" size={17} />
        </button>
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

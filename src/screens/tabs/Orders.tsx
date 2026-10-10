import { useState } from "react";
import UtilityHeader from "../../components/UtilityHeader";
import Icon from "../../components/Icon";
import { serviceMeta } from "../../data/demo";
import { STATUS_LABELS } from "../../state/AppState";
import { formatDay } from "../../lib/format";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Orders() {
  const { push } = useNav();
  const { state } = useApp();
  const [tab, setTab] = useState<"active" | "past">("active");

  const activeOrders = state.orders.filter((o) => o.status < 3);
  const pastOrders = state.orders.filter((o) => o.status >= 3);

  const displayedOrders = tab === "active" ? activeOrders : pastOrders;

  const getStatusText = (o: typeof state.orders[0]) => {
    if (o.status < 3) {
      if (o.service === "food") return o.status === 2 ? "Arriving in 18 minutes" : "Food being prepared";
      if (o.service === "courier") return o.status === 0 ? "Courier is at pickup" : "On the way";
      if (o.service === "rides") return "Driver arriving soon";
      return "Packing essentials";
    }
    return `Delivered · ${formatDay(o.completedAt ?? o.createdAt)}`;
  };

  return (
    <div className="utility-page">
      <UtilityHeader title="Your orders" subtitle="ALL ROADRIDER SERVICES" />

      <div className="utility-tabs">
        <button
          type="button"
          className={tab === "active" ? "active" : ""}
          onClick={() => setTab("active")}
        >
          Active {activeOrders.length > 0 && <i>{activeOrders.length}</i>}
        </button>
        <button
          type="button"
          className={tab === "past" ? "active" : ""}
          onClick={() => setTab("past")}
        >
          Past
        </button>
      </div>

      <div className="cross-order-list">
        {displayedOrders.length === 0 ? (
          <div
            style={{
              padding: "40px 16px",
              textAlign: "center",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--line)",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
              No {tab} orders found.
            </p>
          </div>
        ) : (
          displayedOrders.map((o) => {
            const type = o.service;
            const iconName =
              type === "rides"
                ? "car"
                : type === "grocery"
                ? "bag"
                : type === "courier"
                ? "box"
                : "food";

            return (
              <article
                key={o.id}
                className={`order-${type}`}
                onClick={() => push({ name: "orderDetail", orderId: o.id })}
                style={{ cursor: "pointer" }}
              >
                <span className="service-order-icon">
                  <Icon name={iconName} />
                </span>
                <div>
                  <p>
                    {serviceMeta[type].label} · {tab === "active" ? "ACTIVE" : "PAST"}
                  </p>
                  <h3>{o.title}</h3>
                  <small>{getStatusText(o)}</small>
                </div>
                <div className="order-price">
                  <strong>{rupees(o.bill.toPay)}</strong>
                  <Icon name="arrow" size={16} />
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

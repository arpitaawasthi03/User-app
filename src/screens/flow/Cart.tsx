import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import BillSummary from "../../components/BillSummary";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import {
  PACKAGE_TYPES,
  RIDE_OPTIONS,
  type Service,
} from "../../data/demo";
import { rupees, validatePromo } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface CartProps {
  service: Service;
}

export default function Cart({ service }: CartProps) {
  const { push } = useNav();
  const { state, changeQty, itemTotal, applyPromo, showToast } = useApp();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  const total = itemTotal(service);
  const appliedPromo = state.promos[service] ?? null;

  const handleApplyPromoCode = () => {
    const res = validatePromo(promoInput, service, state.usedPromos, total);
    if (!res.ok) {
      showToast(res.error);
      return;
    }
    applyPromo(service, res.code);
    showToast(`Code ${res.code} applied successfully!`);
    setShowPromoModal(false);
    setPromoInput("");
  };

  const handleRemovePromo = () => {
    applyPromo(service, null);
    showToast("Promo removed");
  };

  const handleContinue = () => {
    if (total <= 0) {
      showToast("Your cart is empty. Please add items.");
      return;
    }
    if (service === "rides") {
      push({ name: "payment", service: "rides" });
    } else {
      push({ name: "address", service });
    }
  };

  const title = service === "rides" ? "Ride summary" : "Your cart";

  return (
    <div className="flow-page checkout">
      <FlowHeader title={title} />

      {service === "food" || service === "grocery" ? (
        <>
          {state.carts[service].lines.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--line)",
                marginTop: 10,
              }}
            >
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)" }}>
                Your {service} cart is currently empty.
              </p>
              <button
                type="button"
                onClick={() => push({ name: "detail", service })}
                style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700 }}
              >
                Browse items
              </button>
            </div>
          ) : (
            state.carts[service].lines.map((line) => (
              <article key={line.id} className="cart-item" style={{ marginBottom: 10 }}>
                <div className="item-thumb">
                  <Icon name={service === "food" ? "food" : "bag"} />
                </div>
                <div>
                  <h3>{line.name}</h3>
                  <p>{line.subtitle}</p>
                  <strong>{rupees(line.price * line.qty)}</strong>
                </div>
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => changeQty(service, line.id, -1)}
                  >
                    −
                  </button>
                  <b>{line.qty}</b>
                  <button
                    type="button"
                    onClick={() => changeQty(service, line.id, 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))
          )}
        </>
      ) : service === "rides" ? (
        (() => {
          const opt =
            RIDE_OPTIONS.find((r) => r.id === state.ride.optionId) ?? RIDE_OPTIONS[1];
          return (
            <article className="cart-item">
              <div className="item-thumb">
                <Icon name="car" />
              </div>
              <div>
                <h3>{opt.name} Ride</h3>
                <p>Arrival in {opt.eta} · Everyday commute</p>
                <strong>{rupees(opt.fare)}</strong>
              </div>
            </article>
          );
        })()
      ) : (
        (() => {
          const pkg =
            PACKAGE_TYPES.find((p) => p.id === state.courier.packageId) ?? PACKAGE_TYPES[1];
          return (
            <article className="cart-item">
              <div className="item-thumb">
                <Icon name="box" />
              </div>
              <div>
                <h3>{pkg.name} ({pkg.weight})</h3>
                <p>Standard delivery · {pkg.time}</p>
                <strong>{rupees(pkg.price)}</strong>
              </div>
            </article>
          );
        })()
      )}

      {/* Promo row */}
      <button
        type="button"
        className="promo-row"
        onClick={() => setShowPromoModal(true)}
      >
        <span>%</span>
        <div>
          <strong>
            {appliedPromo ? `Promo ${appliedPromo} applied` : "Apply a promo code"}
          </strong>
          <small>
            {appliedPromo ? "Tap to change or remove" : "Save more on this order"}
          </small>
        </div>
        <Icon name="arrow" size={18} />
      </button>

      {/* Promo dialog */}
      {showPromoModal && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ fontSize: 12 }}>Enter Coupon Code</strong>
            <button
              type="button"
              onClick={() => setShowPromoModal(false)}
              style={{ fontSize: 11, color: "var(--muted)" }}
            >
              Cancel
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="e.g. WELCOME50"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={handleApplyPromoCode}
              style={{
                padding: "0 14px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Apply
            </button>
          </div>
          {appliedPromo && (
            <button
              type="button"
              onClick={handleRemovePromo}
              style={{ marginTop: 8, fontSize: 10, color: "#c84b31", fontWeight: 700 }}
            >
              Remove current code ({appliedPromo})
            </button>
          )}
          <div style={{ marginTop: 10, fontSize: 10, color: "var(--muted)" }}>
            Available for you: <b>WELCOME50</b> (50% off first order)
          </div>
        </div>
      )}

      <BillSummary service={service} />

      <div className="bottom-action">
        <Button onClick={handleContinue} disabled={total <= 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}

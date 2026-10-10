import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { Service } from "../../data/demo";
import { computeBill, rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface PaymentProps {
  service: Service;
}

export default function Payment({ service }: PaymentProps) {
  const { push } = useNav();
  const { state, itemTotal, placeOrder, placeById, showToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<"wallet" | "upi" | "card">("wallet");

  const total = itemTotal(service);
  const bill = computeBill(service, total, state.promos[service] ?? null);

  const currentPlace =
    placeById(state.defaultPlaceId) ??
    state.places[0] ?? { label: "Home", line: "15, Shahnajaf Road, Hazratganj" };
  const destination =
    service === "rides"
      ? `${placeById(state.ride.dropId)?.area ?? "Gomti Nagar, Lucknow"}`
      : `${currentPlace.label} · ${currentPlace.line}`;

  const handlePay = () => {
    const res = placeOrder(service, selectedMethod, destination);
    if (!res.ok) {
      showToast(res.error);
      return;
    }
    push({ name: "status", orderId: res.order.id, view: "confirmed" });
  };

  const methods: { id: "wallet" | "upi" | "card"; label: string; sub: string }[] = [
    {
      id: "wallet",
      label: "RoadRider Wallet",
      sub: `Available balance ${rupees(state.wallet.balance)}`,
    },
    {
      id: "upi",
      label: "UPI",
      sub: "Google Pay, PhonePe and more",
    },
    {
      id: "card",
      label: "Credit or debit card",
      sub: "Visa ending in 4821",
    },
  ];

  const hasInsufficientWallet =
    selectedMethod === "wallet" && state.wallet.balance < bill.toPay;

  return (
    <div className="flow-page checkout">
      <FlowHeader title="Payment" />

      <div className="total-card">
        <small>TOTAL TO PAY</small>
        <strong>{rupees(bill.toPay)}</strong>
        <span>Secure 256-bit encrypted checkout</span>
      </div>

      <div className="section-heading">
        <h2>Payment method</h2>
      </div>

      {methods.map(({ id, label, sub }) => {
        const isSelected = selectedMethod === id;
        return (
          <button
            key={id}
            type="button"
            className={`payment-card ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedMethod(id)}
          >
            <span>
              <Icon name="card" />
            </span>
            <div>
              <strong>{label}</strong>
              <small>{sub}</small>
            </div>
            <i />
          </button>
        );
      })}

      {hasInsufficientWallet && (
        <div
          style={{
            margin: "8px 0 14px",
            padding: 12,
            background: "#fff2ef",
            border: "1px solid #ffd0c7",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong style={{ fontSize: 11, color: "#c84b31", display: "block" }}>
              Insufficient wallet balance
            </strong>
            <small style={{ fontSize: 9, color: "var(--muted)" }}>
              Short by {rupees(bill.toPay - state.wallet.balance)}
            </small>
          </div>
          <button
            type="button"
            onClick={() => push({ name: "addMoney" })}
            style={{
              padding: "6px 12px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            + Add money
          </button>
        </div>
      )}

      {selectedMethod !== "wallet" && (
        <p
          style={{
            fontSize: 10,
            color: "var(--muted)",
            margin: "6px 4px 12px",
            lineHeight: 1.4,
          }}
        >
          Note: External gateways require backend API keys. To complete this booking, please select <b>RoadRider Wallet</b>.
        </p>
      )}

      <div className="bottom-action">
        <Button onClick={handlePay}>
          Pay {rupees(bill.toPay)}
        </Button>
      </div>
    </div>
  );
}

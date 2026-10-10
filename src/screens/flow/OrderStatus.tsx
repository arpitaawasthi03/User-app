import { useState } from "react";
import MapArt from "../../components/MapArt";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { PARTNER } from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface OrderStatusProps {
  orderId: string;
  initialView?: "confirmed" | "tracking";
}

export default function OrderStatus({ orderId, initialView = "confirmed" }: OrderStatusProps) {
  const { push } = useNav();
  const { state, setOrderStatus, showToast } = useApp();
  const [view, setView] = useState<"confirmed" | "tracking">(initialView);

  const order = state.orders.find((o) => o.id === orderId) ?? state.orders[0];
  const isRide = order?.service === "rides";

  const handleNext = () => {
    if (view === "confirmed") {
      setView("tracking");
    } else {
      if (order) {
        setOrderStatus(order.id, 3);
      }
      push({ name: "complete", orderId });
    }
  };

  const handleCallPartner = () => {
    showToast(`Calling RoadRider Partner ${PARTNER.name} (+91 98765 00123)...`);
  };

  const currentStep = order?.status ?? (view === "tracking" ? 2 : 0);

  return (
    <div className="status-page">
      <div className="status-map">
        <MapArt etaText={isRide ? "4 min" : "18 min"} etaUnit="away" />
        <div className="status-top">
          <Logo />
          <button
            type="button"
            onClick={() => push({ name: "help", orderId })}
          >
            Help
          </button>
        </div>
      </div>

      <section className="tracking-sheet">
        <div className="drag" />
        <p className="eyebrow">
          {view === "confirmed" ? "BOOKING CONFIRMED" : "SIMULATED LIVE UPDATE"}
        </p>
        <h1>
          {view === "confirmed"
            ? isRide
              ? `Meet ${PARTNER.name.split(" ")[0]}, your driver`
              : "We're on it!"
            : isRide
            ? "You're on your way"
            : "Arriving in 18 minutes"}
        </h1>
        <p>
          {view === "confirmed"
            ? "Everything is set. We'll keep you updated with real-time status."
            : "Your RoadRider partner is moving smoothly toward the destination."}
        </p>

        <div className="partner">
          <div className="partner-avatar">{PARTNER.initials}</div>
          <div>
            <strong>{PARTNER.name}</strong>
            <span>
              <Icon name="star" size={12} filled /> {PARTNER.rating} · {PARTNER.trips} deliveries
            </span>
          </div>
          <button
            type="button"
            aria-label="Call partner"
            onClick={handleCallPartner}
          >
            <Icon name="phone" size={18} />
          </button>
        </div>

        <div className="status-steps">
          {["Confirmed", "Picked up", "On the way", "Delivered"].map((label, i) => {
            const isDone = i <= currentStep;
            return (
              <div key={label} className={isDone ? "done" : ""}>
                <i>
                  {isDone && <Icon name="check" size={11} />}
                </i>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <Button onClick={handleNext}>
          {view === "confirmed"
            ? "View live tracking"
            : isRide
            ? "Complete trip"
            : "Mark as delivered"}
        </Button>
      </section>
    </div>
  );
}

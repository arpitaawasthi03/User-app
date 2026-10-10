import { useState, useMemo } from "react";
import MapArt from "../../components/MapArt";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { EtaResult } from "../../components/GoogleMap";
import { RESTAURANTS, GROCERY_HUB, PARTNER } from "../../data/demo";
import { PRESET_COORDS, type LatLng } from "../../lib/googleMaps";
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
  const [liveEta, setLiveEta] = useState<EtaResult | null>(null);

  const order = state.orders.find((o) => o.id === orderId) ?? state.orders[0];
  const isRide = order?.service === "rides";

  // Fetch restaurant from mock data
  const restaurant = useMemo(() => {
    if (order?.service === "food") {
      return (
        RESTAURANTS.find(
          (r) =>
            r.name.toLowerCase() === order.title?.toLowerCase() ||
            r.id === (order as any).storeId
        ) || RESTAURANTS[0]
      );
    }
    return null;
  }, [order]);

  // Destination from user's current place
  const userPlace = state.places.find((p) => p.id === state.defaultPlaceId) ?? state.places[0];
  const destinationCoords: LatLng = useMemo(() => {
    if (userPlace?.coords) {
      return { ...userPlace.coords, label: userPlace.label };
    }
    return PRESET_COORDS.home;
  }, [userPlace]);

  // Origin coords based on restaurant from mock data, grocery hub, or preset
  const originCoords: LatLng = useMemo(() => {
    if (restaurant) {
      return { ...restaurant.coords, label: restaurant.name };
    }
    if (order?.service === "grocery") {
      return { ...GROCERY_HUB.coords, label: GROCERY_HUB.name };
    }
    if (isRide) {
      return PRESET_COORDS.home;
    }
    return PRESET_COORDS.aminabad;
  }, [restaurant, order?.service, isRide]);

  // Driver position along the route
  const driverCoords: LatLng = useMemo(() => {
    const lat = originCoords.lat * 0.45 + destinationCoords.lat * 0.55;
    const lng = originCoords.lng * 0.45 + destinationCoords.lng * 0.55;
    return { lat, lng, label: `${PARTNER.name} (Driver)` };
  }, [originCoords, destinationCoords]);

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
  const displayDuration = liveEta ? liveEta.durationText : (isRide ? "4 min" : "18 min");
  const displayDistance = liveEta?.distanceText;

  return (
    <div className="status-page">
      <div className="status-map">
        <MapArt
          origin={originCoords}
          destination={destinationCoords}
          driver={driverCoords}
          etaText={displayDuration}
          etaUnit="away"
          onEtaCalculated={setLiveEta}
        />
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
          {view === "confirmed" ? "BOOKING CONFIRMED" : "LIVE REAL-TIME TRACKING"}
        </p>
        <h1>
          {view === "confirmed"
            ? isRide
              ? `Meet ${PARTNER.name.split(" ")[0]}, your driver`
              : "We're on it!"
            : isRide
            ? "You're on your way"
            : `Arriving in ${displayDuration}`}
        </h1>
        <p>
          {view === "confirmed"
            ? "Everything is set. We'll keep you updated with real-time status."
            : restaurant
            ? `Dispatched from ${restaurant.name} (${restaurant.address}) · ${displayDistance ? `${displayDistance} away via Google Maps` : "Live Google Maps route"}.`
            : `Your RoadRider partner is moving smoothly toward the destination${displayDistance ? ` (${displayDistance})` : ""}.`}
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

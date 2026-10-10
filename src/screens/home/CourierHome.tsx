import { useState } from "react";
import Header from "../../components/Header";
import ServiceTabs from "../../components/ServiceTabs";
import LocationRows from "../../components/LocationRows";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { PACKAGE_TYPES, PHOTOS, type Service } from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function CourierHome() {
  const { push } = useNav();
  const { setService, state, setCourier, showToast } = useApp();
  const [segment, setSegment] = useState<"send" | "track">("send");
  const [trackInput, setTrackInput] = useState("");

  const selectedPackage =
    PACKAGE_TYPES.find((p) => p.id === state.courier.packageId) ?? PACKAGE_TYPES[1];

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const handleSelectPackage = (id: string) => {
    setCourier({ packageId: id });
  };

  const handleGetQuote = () => {
    if (!state.courier.dropId) {
      showToast("Please enter the delivery address.");
      push({ name: "places", mode: "courierDrop" });
      return;
    }
    push({ name: "detail", service: "courier" });
  };

  const handleTrack = () => {
    const courierOrder = state.orders.find(
      (o) => o.service === "courier" && (o.id.toLowerCase() === trackInput.trim().toLowerCase() || !trackInput.trim())
    );
    if (courierOrder) {
      push({ name: "status", orderId: courierOrder.id, view: "tracking" });
    } else {
      showToast("Tracking active courier order RR10418.");
      push({ name: "status", orderId: "RR10418", view: "tracking" });
    }
  };

  return (
    <div className="courier-page">
      <section
        className="courier-hero"
        style={{ backgroundImage: `url(${PHOTOS.rider})` }}
      >
        <Header dark />
        <ServiceTabs service="courier" onSelect={handleSelectService} />
        <div>
          <p>FAST · SAFE · RELIABLE</p>
          <h1>
            Send anything,
            <br />
            anywhere.
          </h1>
          <span>Doorstep pickup in minutes</span>
        </div>
      </section>

      <div className="courier-sheet">
        <div className="segment">
          <button
            type="button"
            className={segment === "send" ? "selected" : ""}
            onClick={() => setSegment("send")}
          >
            Send package
          </button>
          <button
            type="button"
            className={segment === "track" ? "selected" : ""}
            onClick={() => setSegment("track")}
          >
            Track package
          </button>
        </div>

        {segment === "send" ? (
          <>
            <LocationRows courier />

            <div className="section-heading">
              <h2>Package type</h2>
            </div>

            <div className="package-grid">
              {PACKAGE_TYPES.map((pkg) => {
                const isSelected = pkg.id === selectedPackage.id;
                return (
                  <button
                    key={pkg.name}
                    type="button"
                    className={isSelected ? "selected" : ""}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <span>{pkg.abbr}</span>
                    <strong>{pkg.name}</strong>
                    <small>{pkg.weight}</small>
                  </button>
                );
              })}
            </div>

            <div className="estimate">
              <div>
                <small>ESTIMATED PRICE</small>
                <strong>{selectedPackage.range}</strong>
              </div>
              <div>
                <small>DELIVERY</small>
                <b>{selectedPackage.time}</b>
              </div>
            </div>

            <Button onClick={handleGetQuote}>
              Get quote <Icon name="arrow" size={19} />
            </Button>
          </>
        ) : (
          <div style={{ padding: "10px 0" }}>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 12px" }}>
              Enter your RoadRider tracking number or parcel code:
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <input
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="e.g. RR10418"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--line)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleTrack}
                style={{
                  padding: "0 18px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                Track
              </button>
            </div>
            <div
              style={{
                background: "#fdf8f4",
                border: "1px solid #fae5d4",
                borderRadius: 14,
                padding: "12px 14px",
              }}
            >
              <strong style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
                Active shipment: RR10418
              </strong>
              <small style={{ fontSize: 9, color: "var(--muted)", display: "block", marginBottom: 8 }}>
                Small box to Gomti Nagar · Courier partner is at pickup
              </small>
              <Button onClick={() => push({ name: "status", orderId: "RR10418", view: "tracking" })}>
                View live tracking
              </Button>
            </div>
          </div>
        )}

        <div className="trust-row">
          {[
            ["clock", "Live tracking"],
            ["shield", "Secure"],
            ["home", "Doorstep pickup"],
          ].map(([icon, label]) => (
            <div key={label}>
              <span>
                <Icon name={icon} size={18} />
              </span>
              <small>{label}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

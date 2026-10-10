import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { PlacesMode } from "../../navigation/Navigation";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface AddAddressProps {
  mode: PlacesMode;
}

export default function AddAddress({ mode }: AddAddressProps) {
  const { back } = useNav();
  const { addPlace, setDefaultPlace, setRide, setCourier, showToast } = useApp();

  const [label, setLabel] = useState("Home");
  const [line, setLine] = useState("");
  const [area, setArea] = useState("Lucknow, Uttar Pradesh");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!line.trim()) {
      setError("Please enter house number and street name.");
      return;
    }
    const icon = label === "Home" ? ("home" as const) : ("pin" as const);
    const created = addPlace({ label, line: line.trim(), area: area.trim(), icon });

    if (mode === "delivery" || mode === "manage") setDefaultPlace(created.id);
    else if (mode === "ridePickup") setRide({ pickupId: created.id });
    else if (mode === "rideDrop") setRide({ dropId: created.id });
    else if (mode === "courierPickup") setCourier({ pickupId: created.id });
    else if (mode === "courierDrop") setCourier({ dropId: created.id });

    showToast(`Added "${label}" to saved addresses!`);
    back();
  };

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="pin" size={28} />
        </span>
        <p>NEW LOCATION</p>
        <h1>Add new address</h1>
        <p>Enter your complete address details for accurate deliveries.</p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 17,
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            ADDRESS LABEL
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Home", "Work", "Other"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setLabel(tag)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  border: label === tag ? "1px solid var(--accent)" : "1px solid var(--line)",
                  background: label === tag ? "var(--accent-soft)" : "#fff",
                  color: label === tag ? "var(--accent)" : "inherit",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            HOUSE / FLAT / BUILDING & STREET
          </label>
          <input
            placeholder="e.g. 24B, Naval Kishore Road, Hazratganj"
            value={line}
            onChange={(e) => {
              setLine(e.target.value);
              if (error) setError("");
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: error ? "1px solid #c84b31" : "1px solid var(--line)",
              fontSize: 12,
              outline: "none",
            }}
          />
          {error && (
            <small style={{ color: "#c84b31", fontSize: 10, marginTop: 4, display: "block" }}>
              {error}
            </small>
          )}
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            AREA / CITY / PINCODE
          </label>
          <input
            placeholder="e.g. Hazratganj, Lucknow · 226001"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div className="more-action">
        <Button onClick={handleSave}>Save address</Button>
      </div>
    </div>
  );
}

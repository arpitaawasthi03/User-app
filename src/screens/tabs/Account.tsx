import { useState } from "react";
import UtilityHeader from "../../components/UtilityHeader";
import Icon from "../../components/Icon";
import { SERVICES, serviceMeta, type Service } from "../../data/demo";
import { initials, prettyPhone } from "../../lib/format";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Account() {
  const { push, switchTab } = useNav();
  const { state, setService } = useApp();
  const [activityTab, setActivityTab] = useState<"active" | "past">("active");

  const userName = state.profile.name || "Arjun Khanna";
  const userPhone = state.profile.phone ? `+91 ${prettyPhone(state.profile.phone)}` : "+91 98765 43210";
  const userInitials = initials(userName);

  const activeOrders = state.orders.filter((o) => o.status < 3);
  const pastOrders = state.orders.filter((o) => o.status >= 3);
  const currentPreview = activityTab === "active" ? activeOrders[0] : pastOrders[0];

  const handleSelectService = (s: Service) => {
    setService(s);
    switchTab("home");
  };

  const menuItems = [
    { icon: "heart", label: `Your favorites (${state.favorites.length})`, route: { name: "favorites" as const } },
    { icon: "pin", label: "Saved addresses", route: { name: "places" as const, mode: "manage" as const } },
    { icon: "card", label: "Payment methods", route: { name: "paymentMethods" as const } },
    { icon: "box", label: "Your orders", route: { name: "orders" as const } },
    { icon: "shield", label: "Help & support", route: { name: "help" as const } },
    { icon: "user", label: "Profile & settings", route: { name: "profile" as const } },
  ];

  return (
    <div className="account-page">
      <UtilityHeader title="Account" subtitle="PROFILE & SETTINGS" />

      <section className="profile-card">
        <div className="avatar large">{userInitials}</div>
        <div>
          <h1>{userName}</h1>
          <p>{userPhone}</p>
        </div>
        <button
          type="button"
          onClick={() => push({ name: "profile" })}
        >
          Edit
        </button>
      </section>

      <div className="wallet-card">
        <div>
          <small>ROADRIDER WALLET</small>
          <strong>{rupees(state.wallet.balance)}.00</strong>
          <p>Available balance</p>
        </div>
        <button
          type="button"
          onClick={() => push({ name: "addMoney" })}
        >
          + Add money
        </button>
      </div>

      <div className="section-heading">
        <h2>Your activity</h2>
        <button
          type="button"
          onClick={() => push({ name: "orders" })}
        >
          See all
        </button>
      </div>

      <div className="order-tabs">
        <button
          type="button"
          className={activityTab === "active" ? "selected" : ""}
          onClick={() => setActivityTab("active")}
        >
          Active
        </button>
        <button
          type="button"
          className={activityTab === "past" ? "selected" : ""}
          onClick={() => setActivityTab("past")}
        >
          Past
        </button>
      </div>

      {currentPreview ? (
        <article
          className="active-order"
          onClick={() => push({ name: "orderDetail", orderId: currentPreview.id })}
          style={{ cursor: "pointer" }}
        >
          <span className="order-icon">
            <Icon
              name={
                currentPreview.service === "rides"
                  ? "car"
                  : currentPreview.service === "grocery"
                  ? "bag"
                  : currentPreview.service === "courier"
                  ? "box"
                  : "food"
              }
            />
          </span>
          <div>
            <small>
              {serviceMeta[currentPreview.service].label.toUpperCase()} ·{" "}
              {currentPreview.status === 2 ? "ON THE WAY" : currentPreview.status < 2 ? "CONFIRMED" : "COMPLETED"}
            </small>
            <strong>{currentPreview.title}</strong>
            <p>
              {currentPreview.status < 3 ? "Arriving in 18 minutes" : "Delivered safely"}
            </p>
          </div>
          <Icon name="arrow" />
        </article>
      ) : (
        <div
          style={{
            marginTop: 11,
            padding: "16px",
            background: "#fff",
            borderRadius: 15,
            border: "1px solid var(--line)",
            textAlign: "center",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          No {activityTab} activity recorded.
        </div>
      )}

      <div className="menu-list">
        {menuItems.map(({ icon, label, route }) => (
          <button
            key={label}
            type="button"
            onClick={() => push(route)}
          >
            <span>
              <Icon name={icon} />
            </span>
            <strong>{label}</strong>
            <Icon name="arrow" size={18} />
          </button>
        ))}
      </div>

      <div className="explore-services">
        <p>Explore services</p>
        <div>
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelectService(s)}
            >
              {serviceMeta[s].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

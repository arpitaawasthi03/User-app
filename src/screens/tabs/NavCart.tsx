import UtilityHeader from "../../components/UtilityHeader";
import LocationRows from "../../components/LocationRows";
import BillSummary from "../../components/BillSummary";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import {
  PACKAGE_TYPES,
  RESTAURANTS,
  RIDE_OPTIONS,
  serviceMeta,
} from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function NavCart() {
  const { push, switchTab } = useNav();
  const { state, changeQty, itemTotal } = useApp();
  const service = state.service;

  const total = itemTotal(service);

  const getServiceContent = () => {
    switch (service) {
      case "food": {
        const lines = state.carts.food.lines;
        const main = lines[0] ?? {
          name: "Lucknowi Chicken Biryani",
          subtitle: "Royal Biryani House",
          price: 289,
          qty: 1,
        };
        const store = RESTAURANTS.find((r) => r.id === state.carts.food.storeId) ?? RESTAURANTS[0];
        return {
          title: "Your food cart",
          subtitle: store.name,
          item: main.name,
          detail: `${lines.length || 1} item · Delivery in ${store.eta}`,
          price: rupees(total > 0 ? total : 289),
          icon: "food",
          qty: main.qty,
          id: main.id,
        };
      }
      case "rides": {
        const opt =
          RIDE_OPTIONS.find((r) => r.id === state.ride.optionId) ?? RIDE_OPTIONS[1];
        return {
          title: "Current ride",
          subtitle: "Booking summary",
          item: `${opt.name} to Gomti Nagar`,
          detail: `Pickup: Hazratganj · ${opt.eta} away`,
          price: rupees(opt.fare),
          icon: "car",
          qty: 1,
          id: opt.id,
        };
      }
      case "grocery": {
        const lines = state.carts.grocery.lines;
        const count = lines.reduce((n, l) => n + l.qty, 0) || 2;
        return {
          title: "Your grocery cart",
          subtitle: `${count} daily essentials`,
          item: "Fresh produce basket",
          detail: "Tomatoes, organic broccoli · 15 min",
          price: rupees(total > 0 ? total : 328),
          icon: "bag",
          qty: count,
          id: lines[0]?.id ?? "gr-tomatoes",
        };
      }
      case "courier": {
        const pkg =
          PACKAGE_TYPES.find((p) => p.id === state.courier.packageId) ?? PACKAGE_TYPES[1];
        return {
          title: "Package in progress",
          subtitle: "Your delivery quote",
          item: `${pkg.name} · ${pkg.weight}`,
          detail: "Hazratganj to Gomti Nagar · 6.2 km",
          price: rupees(pkg.price),
          icon: "box",
          qty: 1,
          id: pkg.id,
        };
      }
    }
  };

  const content = getServiceContent();

  const handleCheckout = () => {
    push({ name: "cart", service });
  };

  const handleBrowse = () => {
    switchTab("home");
  };

  return (
    <div className="utility-page cart-destination">
      <UtilityHeader
        title={content.title}
        subtitle={serviceMeta[service].label.toUpperCase()}
      />

      <div className="context-chip">
        <span>
          <Icon name={content.icon} size={15} />
        </span>
        {serviceMeta[service].label}
      </div>

      <article className="nav-cart-card">
        <span className="nav-cart-icon">
          <Icon name={content.icon} size={25} />
        </span>
        <div>
          <p>{content.subtitle}</p>
          <h2>{content.item}</h2>
          <small>{content.detail}</small>
          <strong>{content.price}</strong>
        </div>
      </article>

      {service === "food" || service === "grocery" ? (
        <div className="quantity-row">
          <span>Quantity</span>
          <div className="stepper">
            <button
              type="button"
              onClick={() => changeQty(service, content.id, -1)}
            >
              −
            </button>
            <b>{content.qty}</b>
            <button
              type="button"
              onClick={() => changeQty(service, content.id, 1)}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="route-summary" style={{ marginTop: 10 }}>
          <LocationRows courier={service === "courier"} />
        </div>
      )}

      <BillSummary service={service} />

      <button
        type="button"
        className="browse-link"
        onClick={handleBrowse}
      >
        Continue browsing {serviceMeta[service].label}
      </button>

      <div className="utility-action">
        <Button onClick={handleCheckout}>
          {service === "rides"
            ? "Continue booking"
            : service === "courier"
            ? "Review quote"
            : "Proceed to checkout"}
        </Button>
      </div>
    </div>
  );
}

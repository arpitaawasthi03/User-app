import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import {
  PACKAGE_TYPES,
  PRODUCTS,
  RESTAURANTS,
  serviceMeta,
} from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface StoreDetailProps {
  service: "food" | "grocery" | "courier";
  storeId?: string;
}

export default function StoreDetail({ service, storeId }: StoreDetailProps) {
  const { push } = useNav();
  const { state, addToCart, changeQty, itemTotal } = useApp();

  const total = itemTotal(service);

  if (service === "food") {
    const restaurant =
      RESTAURANTS.find((r) => r.id === storeId) ?? RESTAURANTS[0];
    const cartLines = state.carts.food.lines;

    const handleAdd = (item: typeof restaurant.menu[0]) => {
      addToCart(
        "food",
        {
          id: item.id,
          name: item.name,
          subtitle: "1 portion · Fragrant & freshly cooked",
          price: item.price,
        },
        restaurant.id
      );
    };

    const handleContinue = () => {
      if (cartLines.length === 0) {
        // Auto-add primary item as in design if cart empty
        handleAdd(restaurant.menu[0]);
      }
      push({ name: "cart", service: "food" });
    };

    const displayPrice = total > 0 ? rupees(total) : rupees(restaurant.menu[0].price);

    return (
      <div className="flow-page">
        <div
          className="detail-cover"
          style={{ backgroundImage: `url(${restaurant.photo})` }}
        >
          <FlowHeader title="" />
          <span className="detail-badge">{serviceMeta.food.label}</span>
        </div>

        <section className="detail-content">
          <p className="eyebrow">{serviceMeta.food.kicker}</p>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisines.join(" · ")} · {restaurant.eta}</p>

          <div className="stat-row">
            <span>
              <Icon name="star" size={14} filled /> {restaurant.detailRating} rating
            </span>
            <span>
              <Icon name="clock" size={14} /> Fast delivery
            </span>
          </div>

          <div className="section-heading">
            <h2>Recommended for you</h2>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {restaurant.menu.map((item) => {
              const line = cartLines.find((l) => l.id === item.id);
              const qty = line?.qty ?? 0;
              return (
                <article key={item.id} className="line-item">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <strong>{rupees(item.price)}</strong>
                  </div>
                  {qty > 0 ? (
                    <div className="stepper" style={{ alignSelf: "end" }}>
                      <button
                        type="button"
                        onClick={() => changeQty("food", item.id, -1)}
                      >
                        −
                      </button>
                      <b>{qty}</b>
                      <button
                        type="button"
                        onClick={() => changeQty("food", item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                    >
                      Add +
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="bottom-action">
          <Button onClick={handleContinue}>
            Add to cart · {displayPrice}
          </Button>
        </div>
      </div>
    );
  }

  if (service === "grocery") {
    const cartLines = state.carts.grocery.lines;

    const handleAdd = (p: typeof PRODUCTS[0]) => {
      addToCart(
        "grocery",
        {
          id: p.id,
          name: p.name,
          subtitle: `${p.unit} · Fresh essentials`,
          price: p.price,
        },
        "roadrider-grocery"
      );
    };

    const handleContinue = () => {
      if (cartLines.length === 0) {
        // Seed initial products if empty so user experiences checkout
        handleAdd(PRODUCTS[0]);
        handleAdd(PRODUCTS[1]);
      }
      push({ name: "cart", service: "grocery" });
    };

    const displayPrice = total > 0 ? rupees(total) : "₹328";

    return (
      <div className="flow-page">
        <div
          className="detail-cover"
          style={{ backgroundImage: `url(${serviceMeta.grocery.photo})` }}
        >
          <FlowHeader title="" />
          <span className="detail-badge">{serviceMeta.grocery.label}</span>
        </div>

        <section className="detail-content">
          <p className="eyebrow">{serviceMeta.grocery.kicker}</p>
          <h1>Your basket</h1>
          <p>Fresh picks delivered in 15 minutes</p>

          <div className="stat-row">
            <span>
              <Icon name="star" size={14} filled /> 4.9 rating
            </span>
            <span>
              <Icon name="clock" size={14} /> 15 min express
            </span>
          </div>

          <div className="section-heading">
            <h2>In your basket</h2>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {PRODUCTS.map((p) => {
              const line = cartLines.find((l) => l.id === p.id);
              const qty = line?.qty ?? (cartLines.length === 0 ? 1 : 0);
              return (
                <article key={p.id} className="line-item">
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.unit} · Fresh daily stock</p>
                    <strong>{rupees(p.price)}</strong>
                  </div>
                  {qty > 0 && cartLines.length > 0 ? (
                    <div className="stepper" style={{ alignSelf: "end" }}>
                      <button
                        type="button"
                        onClick={() => changeQty("grocery", p.id, -1)}
                      >
                        −
                      </button>
                      <b>{qty}</b>
                      <button
                        type="button"
                        onClick={() => changeQty("grocery", p.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdd(p)}
                    >
                      Add +
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="bottom-action">
          <Button onClick={handleContinue}>
            View basket · {displayPrice}
          </Button>
        </div>
      </div>
    );
  }

  // Courier service detail
  const pkg =
    PACKAGE_TYPES.find((p) => p.id === state.courier.packageId) ?? PACKAGE_TYPES[1];

  return (
    <div className="flow-page">
      <div
        className="detail-cover"
        style={{ backgroundImage: `url(${serviceMeta.courier.photo})` }}
      >
        <FlowHeader title="" />
        <span className="detail-badge">{serviceMeta.courier.label}</span>
      </div>

      <section className="detail-content">
        <p className="eyebrow">{serviceMeta.courier.kicker}</p>
        <h1>Your delivery quote</h1>
        <p>Doorstep pickup · Standard city delivery</p>

        <div className="stat-row">
          <span>
            <Icon name="star" size={14} filled /> 4.9 rating
          </span>
          <span>
            <Icon name="clock" size={14} /> {pkg.time}
          </span>
        </div>

        <div className="section-heading">
          <h2>Quote breakdown</h2>
        </div>

        <article className="line-item">
          <div>
            <h3>{pkg.name} · {pkg.weight}</h3>
            <p>Carefully handled and protected throughout the journey.</p>
            <strong>{rupees(pkg.price)}</strong>
          </div>
          <button
            type="button"
            onClick={() => push({ name: "cart", service: "courier" })}
          >
            Select
          </button>
        </article>
      </section>

      <div className="bottom-action">
        <Button onClick={() => push({ name: "cart", service: "courier" })}>
          Continue to payment
        </Button>
      </div>
    </div>
  );
}

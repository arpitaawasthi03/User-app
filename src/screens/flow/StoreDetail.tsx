import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import {
  PACKAGE_TYPES,
  PRODUCTS,
  RESTAURANTS,
  serviceMeta,
  type MenuItem,
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
  const { state, addToCart, changeQty, itemTotal, toggleFavorite, showToast } = useApp();

  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedPortionId, setSelectedPortionId] = useState<string>("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  const total = itemTotal(service);

  if (service === "food") {
    const restaurant =
      RESTAURANTS.find((r) => r.id === storeId) ?? RESTAURANTS[0];
    const cartLines = state.carts.food.lines;

    const openCustomizer = (item: MenuItem) => {
      setCustomizingItem(item);
      setSelectedPortionId(item.portions?.[0]?.id ?? "");
      setSelectedAddonIds([]);
    };

    const handleApplyCustomization = () => {
      if (!customizingItem) return;
      const activePortion =
        customizingItem.portions?.find((p) => p.id === selectedPortionId) ?? null;
      const basePrice = activePortion ? activePortion.price : customizingItem.price;
      const selectedAddons = (customizingItem.addons ?? []).filter((a) =>
        selectedAddonIds.includes(a.id)
      );
      const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const finalPrice = basePrice + addonsTotal;

      const portionPart = activePortion ? activePortion.name : "1 portion";
      const addonsPart =
        selectedAddons.length > 0
          ? selectedAddons.map((a) => a.name).join(", ")
          : "";
      const subtitle = addonsPart ? `${portionPart} · ${addonsPart}` : portionPart;

      const variantId = `${customizingItem.id}${
        selectedPortionId ? `-${selectedPortionId}` : ""
      }${
        selectedAddonIds.length > 0 ? `-${selectedAddonIds.sort().join("-")}` : ""
      }`;

      addToCart(
        "food",
        {
          id: variantId,
          name: customizingItem.name,
          subtitle,
          price: finalPrice,
        },
        restaurant.id
      );
      setCustomizingItem(null);
    };

    const handleAdd = (item: MenuItem) => {
      if (
        (item.portions && item.portions.length > 0) ||
        (item.addons && item.addons.length > 0)
      ) {
        openCustomizer(item);
        return;
      }

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
        const defaultItem = restaurant.menu[0];
        if (defaultItem.portions && defaultItem.portions.length > 0) {
          const portion = defaultItem.portions[0];
          addToCart(
            "food",
            {
              id: `${defaultItem.id}-${portion.id}`,
              name: defaultItem.name,
              subtitle: portion.name,
              price: portion.price,
            },
            restaurant.id
          );
        } else {
          handleAdd(defaultItem);
        }
      }
      push({ name: "cart", service: "food" });
    };

    const displayPrice =
      total > 0
        ? rupees(total)
        : restaurant.menu[0].portions?.[0]
        ? rupees(restaurant.menu[0].portions[0].price)
        : rupees(restaurant.menu[0].price);

    const activePortion =
      customizingItem?.portions?.find((p) => p.id === selectedPortionId) ?? null;
    const baseCustomPrice = activePortion
      ? activePortion.price
      : customizingItem?.price ?? 0;
    const customAddonsTotal = (customizingItem?.addons ?? [])
      .filter((a) => selectedAddonIds.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    const customizedTotal = baseCustomPrice + customAddonsTotal;

    return (
      <div className="flow-page">
        <div
          className="detail-cover"
          style={{ backgroundImage: `url(${restaurant.photo})` }}
        >
          <FlowHeader title="" />
          <button
            type="button"
            onClick={() => {
              toggleFavorite(restaurant.id);
              showToast(
                state.favorites.includes(restaurant.id)
                  ? `Removed ${restaurant.name} from favorites`
                  : `Added ${restaurant.name} to favorites`
              );
            }}
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              zIndex: 10,
              background: "rgba(0,0,0,0.45)",
              border: "none",
              color: state.favorites.includes(restaurant.id) ? "#ff4d2e" : "#fff",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
            }}
            aria-label="Favorite restaurant"
          >
            <Icon name="heart" size={18} filled={state.favorites.includes(restaurant.id)} />
          </button>
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
              const matchingLines = cartLines.filter(
                (l) => l.id === item.id || l.id.startsWith(item.id + "-")
              );
              const totalQty = matchingLines.reduce((sum, l) => sum + l.qty, 0);
              const hasCustomizations =
                (item.portions && item.portions.length > 0) ||
                (item.addons && item.addons.length > 0);
              const isDishFav = state.favorites.includes(item.id);

              return (
                <article key={item.id} className="line-item">
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 3,
                      }}
                    >
                      <h3>{item.name}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          toggleFavorite(item.id);
                          showToast(
                            isDishFav
                              ? `Removed ${item.name} from favorites`
                              : `Added ${item.name} to favorites`
                          );
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: isDishFav ? "#ff4d2e" : "#c5bdb6",
                          cursor: "pointer",
                          padding: 2,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        aria-label="Favorite dish"
                      >
                        <Icon name="heart" size={13} filled={isDishFav} />
                      </button>
                      {item.portions && item.portions.length > 0 && (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            background: "var(--accent-soft)",
                            color: "var(--accent)",
                            padding: "2px 6px",
                            borderRadius: 5,
                          }}
                        >
                          Half & Full plate
                        </span>
                      )}
                    </div>
                    <p>{item.description}</p>
                    <div>
                      <strong>
                        {item.portions && item.portions.length > 0
                          ? `From ${rupees(item.portions[0].price)}`
                          : rupees(item.price)}
                      </strong>
                      {item.portions && item.portions.length > 0 && (
                        <span
                          style={{
                            fontSize: 9,
                            color: "var(--muted)",
                            marginLeft: 6,
                          }}
                        >
                          ({item.portions
                            .map(
                              (p) => `${p.name.split(" ")[0]} ${rupees(p.price)}`
                            )
                            .join(" · ")})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="line-item-action">
                    {totalQty > 0 ? (
                      <div className="stepper">
                        <button
                          type="button"
                          onClick={() => {
                            const targetLine =
                              matchingLines[matchingLines.length - 1];
                            if (targetLine) {
                              changeQty("food", targetLine.id, -1);
                            }
                          }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <b>{totalQty}</b>
                        <button
                          type="button"
                          onClick={() => {
                            if (hasCustomizations) {
                              openCustomizer(item);
                            } else {
                              changeQty("food", item.id, 1);
                            }
                          }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (hasCustomizations) {
                            openCustomizer(item);
                          } else {
                            handleAdd(item);
                          }
                        }}
                      >
                        Add +
                      </button>
                    )}
                    {hasCustomizations && (
                      <span
                        className="line-item-custom-badge"
                        style={{ cursor: "pointer" }}
                        onClick={() => openCustomizer(item)}
                      >
                        Customise
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Customization Bottom Sheet */}
        {customizingItem && (
          <div
            className="customize-overlay"
            onClick={() => setCustomizingItem(null)}
          >
            <div
              className="customize-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-drag" />
              <div className="sheet-header">
                <div>
                  <h3>{customizingItem.name}</h3>
                  <p>{customizingItem.description}</p>
                </div>
                <button
                  type="button"
                  className="sheet-close"
                  onClick={() => setCustomizingItem(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="sheet-scroll">
                {/* Portions section (Half / Full Plate, etc.) */}
                {customizingItem.portions &&
                  customizingItem.portions.length > 0 && (
                    <div>
                      <div className="sheet-section-title">
                        <h4>Select Portion Size</h4>
                        <span className="sheet-badge req">Required</span>
                      </div>
                      <div className="sheet-option-list">
                        {customizingItem.portions.map((portion) => {
                          const isSelected = selectedPortionId === portion.id;
                          return (
                            <div
                              key={portion.id}
                              className={`sheet-option-card ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => setSelectedPortionId(portion.id)}
                            >
                              <div className="sheet-option-left">
                                <div className="sheet-radio">
                                  {isSelected && (
                                    <div className="sheet-radio-dot" />
                                  )}
                                </div>
                                <span className="sheet-option-name">
                                  {portion.name}
                                </span>
                              </div>
                              <span className="sheet-option-price">
                                {rupees(portion.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Addons section (Extra Cheese, Chutneys, Dips, etc.) */}
                {customizingItem.addons && customizingItem.addons.length > 0 && (
                  <div>
                    <div className="sheet-section-title">
                      <h4>Extra Add-ons & Additionals</h4>
                      <span className="sheet-badge opt">Optional</span>
                    </div>
                    <div className="sheet-option-list">
                      {customizingItem.addons.map((addon) => {
                        const isSelected = selectedAddonIds.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            className={`sheet-option-card ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedAddonIds((prev) =>
                                isSelected
                                  ? prev.filter((id) => id !== addon.id)
                                  : [...prev, addon.id]
                              );
                            }}
                          >
                            <div className="sheet-option-left">
                              <div className="sheet-checkbox">
                                {isSelected && "✓"}
                              </div>
                              <span className="sheet-option-name">
                                {addon.name}
                              </span>
                            </div>
                            <span className="sheet-option-price">
                              +{rupees(addon.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="sheet-footer">
                <div className="sheet-footer-price">
                  <small>Total Price</small>
                  <strong>{rupees(customizedTotal)}</strong>
                </div>
                <button
                  type="button"
                  className="sheet-submit-btn"
                  onClick={handleApplyCustomization}
                >
                  Add to Cart · {rupees(customizedTotal)}
                </button>
              </div>
            </div>
          </div>
        )}

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
                  <div className="line-item-action">
                    {qty > 0 && cartLines.length > 0 ? (
                      <div className="stepper">
                        <button
                          type="button"
                          onClick={() => changeQty("grocery", p.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <b>{qty}</b>
                        <button
                          type="button"
                          onClick={() => changeQty("grocery", p.id, 1)}
                          aria-label="Increase quantity"
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
                  </div>
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

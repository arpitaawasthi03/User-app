import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Icon from "../../components/Icon";
import { PRODUCTS, RESTAURANTS, type MenuItem, type Restaurant } from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Favorites() {
  const { push, switchTab } = useNav();
  const { state, toggleFavorite, addToCart, showToast, setService } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "dishes" | "restaurants" | "groceries">("all");

  // Collect favorited restaurants
  const favoriteRestaurants: Restaurant[] = RESTAURANTS.filter((r) =>
    state.favorites.includes(r.id)
  );

  // Collect favorited dishes across all restaurant menus
  const favoriteDishes: { dish: MenuItem; restaurant: Restaurant }[] = [];
  for (const r of RESTAURANTS) {
    for (const m of r.menu) {
      if (state.favorites.includes(m.id)) {
        favoriteDishes.push({ dish: m, restaurant: r });
      }
    }
  }

  // Collect favorited groceries
  const favoriteGroceries = PRODUCTS.filter((p) =>
    state.favorites.includes(p.id)
  );

  const totalCount =
    favoriteRestaurants.length + favoriteDishes.length + favoriteGroceries.length;

  const handleAddDish = (dish: MenuItem, restaurant: Restaurant) => {
    // If dish has portions, navigate to restaurant menu so customer can select options
    if (dish.portions && dish.portions.length > 0) {
      setService("food");
      push({ name: "detail", service: "food", storeId: restaurant.id });
      showToast(`Select portion size for ${dish.name}`);
      return;
    }

    addToCart(
      "food",
      {
        id: dish.id,
        name: dish.name,
        subtitle: `${restaurant.name} · Fragrant & freshly cooked`,
        price: dish.price,
      },
      restaurant.id
    );
    showToast(`Added ${dish.name} to cart`);
  };

  const handleAddGrocery = (product: (typeof PRODUCTS)[0]) => {
    addToCart(
      "grocery",
      {
        id: product.id,
        name: product.name,
        subtitle: `${product.unit} · Fresh daily essentials`,
        price: product.price,
      },
      "roadrider-grocery"
    );
    showToast(`Added ${product.name} to basket`);
  };

  return (
    <div className="flow-page favorites-page" style={{ padding: "0 18px 90px" }}>
      <FlowHeader title="Your Favorites" />

      <div style={{ marginTop: 6, marginBottom: 16 }}>
        <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--muted)" }}>
          SAVED & LIKED ITEMS
        </p>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1c1815" }}>
          Everything you love
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)" }}>
          Quickly reorder your favorite meals, top restaurants, and everyday essentials.
        </p>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 16,
          scrollbarWidth: "none",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          style={{
            padding: "7px 13px",
            borderRadius: 20,
            border: activeTab === "all" ? "1.5px solid var(--accent)" : "1px solid var(--line)",
            background: activeTab === "all" ? "var(--accent)" : "#fff",
            color: activeTab === "all" ? "#fff" : "var(--muted)",
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dishes")}
          style={{
            padding: "7px 13px",
            borderRadius: 20,
            border: activeTab === "dishes" ? "1.5px solid var(--accent)" : "1px solid var(--line)",
            background: activeTab === "dishes" ? "var(--accent)" : "#fff",
            color: activeTab === "dishes" ? "#fff" : "var(--muted)",
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Dishes ({favoriteDishes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("restaurants")}
          style={{
            padding: "7px 13px",
            borderRadius: 20,
            border: activeTab === "restaurants" ? "1.5px solid var(--accent)" : "1px solid var(--line)",
            background: activeTab === "restaurants" ? "var(--accent)" : "#fff",
            color: activeTab === "restaurants" ? "#fff" : "var(--muted)",
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Restaurants ({favoriteRestaurants.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("groceries")}
          style={{
            padding: "7px 13px",
            borderRadius: 20,
            border: activeTab === "groceries" ? "1.5px solid var(--accent)" : "1px solid var(--line)",
            background: activeTab === "groceries" ? "var(--accent)" : "#fff",
            color: activeTab === "groceries" ? "#fff" : "var(--muted)",
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          Groceries ({favoriteGroceries.length})
        </button>
      </div>

      {totalCount === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid var(--line)",
            padding: "36px 20px",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icon name="heart" size={32} />
          </div>
          <h2 style={{ fontSize: 17, margin: "0 0 6px", color: "#1c1815" }}>
            No favorites saved yet
          </h2>
          <p
            style={{
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.5,
              margin: "0 auto 20px",
              maxWidth: 240,
            }}
          >
            Tap the heart icon on any dish, restaurant, or grocery item to keep it handy here.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                setService("food");
                switchTab("home");
              }}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse Food
            </button>
            <button
              type="button"
              onClick={() => {
                setService("grocery");
                switchTab("home");
              }}
              style={{
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse Groceries
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Favorite Dishes */}
          {(activeTab === "all" || activeTab === "dishes") &&
            favoriteDishes.map(({ dish, restaurant }) => (
              <article
                key={dish.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--line)",
                  padding: "14px 15px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="food" size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                        padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      DISH
                    </span>
                    <small style={{ fontSize: 9, color: "var(--muted)" }}>
                      {restaurant.name}
                    </small>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 2px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1c1815",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dish.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 10,
                      color: "var(--muted)",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {dish.description}
                  </p>
                  <strong style={{ fontSize: 13, color: "var(--accent)" }}>
                    {dish.portions && dish.portions.length > 0
                      ? `From ${rupees(dish.portions[0].price)}`
                      : rupees(dish.price)}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite(dish.id);
                      showToast(`Removed ${dish.name} from favorites`);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e05a0f",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    aria-label="Remove from favorites"
                  >
                    <Icon name="heart" size={17} filled />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDish(dish, restaurant)}
                    style={{
                      border: "1.5px solid var(--accent)",
                      background: "#fff",
                      color: "var(--accent)",
                      borderRadius: 9,
                      padding: "6px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {dish.portions?.length ? "Options +" : "Add +"}
                  </button>
                </div>
              </article>
            ))}

          {/* Favorite Restaurants */}
          {(activeTab === "all" || activeTab === "restaurants") &&
            favoriteRestaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--line)",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  style={{
                    height: 110,
                    backgroundImage: `url(${restaurant.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      padding: "4px 7px",
                      borderRadius: 6,
                    }}
                  >
                    {restaurant.discount}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite(restaurant.id);
                      showToast(`Removed ${restaurant.name} from favorites`);
                    }}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.45)",
                      border: "none",
                      color: "#e05a0f",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(6px)",
                    }}
                    aria-label="Remove from favorites"
                  >
                    <Icon name="heart" size={16} filled />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 12,
                      right: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#fff",
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700 }}>
                      ⭐ {restaurant.rating} · {restaurant.eta}
                    </span>
                    <span
                      style={{
                        fontSize: 8,
                        background: "rgba(255,255,255,0.25)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      RESTAURANT
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 2px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1c1815",
                      }}
                    >
                      {restaurant.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10,
                        color: "var(--muted)",
                      }}
                    >
                      {restaurant.cuisines.join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setService("food");
                      push({ name: "detail", service: "food", storeId: restaurant.id });
                    }}
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "7px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View Menu
                  </button>
                </div>
              </article>
            ))}

          {/* Favorite Groceries */}
          {(activeTab === "all" || activeTab === "groceries") &&
            favoriteGroceries.map((product) => (
              <article
                key={product.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--line)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: "#eef7f0",
                    color: "#2e7d32",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="bag" size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        background: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      GROCERY
                    </span>
                    <small style={{ fontSize: 9, color: "var(--muted)" }}>
                      15 min express
                    </small>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 2px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1c1815",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 10,
                      color: "var(--muted)",
                    }}
                  >
                    {product.unit} · Fresh daily stock
                  </p>
                  <strong style={{ fontSize: 13, color: "#2e7d32" }}>
                    {rupees(product.price)}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleFavorite(product.id);
                      showToast(`Removed ${product.name} from favorites`);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e05a0f",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    aria-label="Remove from favorites"
                  >
                    <Icon name="heart" size={17} filled />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddGrocery(product)}
                    style={{
                      border: "1.5px solid #2e7d32",
                      background: "#fff",
                      color: "#2e7d32",
                      borderRadius: 9,
                      padding: "6px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Add +
                  </button>
                </div>
              </article>
            ))}
        </div>
      )}
    </div>
  );
}

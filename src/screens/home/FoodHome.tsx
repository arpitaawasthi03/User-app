import { useState } from "react";
import Header from "../../components/Header";
import ServiceTabs from "../../components/ServiceTabs";
import SearchBar from "../../components/SearchBar";
import Icon from "../../components/Icon";
import {
  FOOD_CATEGORIES,
  MORE_CUISINES,
  PHOTOS,
  RESTAURANTS,
  serviceMeta,
  type Service,
} from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { rupees } from "../../lib/pricing";

export default function FoodHome() {
  const { push } = useNav();
  const { setService, state, toggleFavorite, applyPromo, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMoreCuisines, setShowMoreCuisines] = useState(false);
  const [filterOnlyLiked, setFilterOnlyLiked] = useState(false);

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  // Aggregated preview list for "Your favorites" slider
  const favRestaurants = RESTAURANTS.filter((r) => state.favorites.includes(r.id));
  const favDishes: { id: string; name: string; price: number; restaurant: typeof RESTAURANTS[0] }[] = [];
  for (const r of RESTAURANTS) {
    for (const m of r.menu) {
      if (state.favorites.includes(m.id)) {
        favDishes.push({ id: m.id, name: m.name, price: m.price, restaurant: r });
      }
    }
  }

  const favoritePreviews = [
    ...favRestaurants.map((r) => ({
      id: r.id,
      title: r.name,
      subtitle: r.cuisines.join(" · "),
      meta: `⭐ ${r.rating} · ${r.eta}`,
      tag: "RESTAURANT",
      photo: r.photo,
      onClick: () => push({ name: "detail", service: "food", storeId: r.id }),
    })),
    ...favDishes.map((d) => ({
      id: d.id,
      title: d.name,
      subtitle: d.restaurant.name,
      meta: rupees(d.price),
      tag: "DISH",
      photo: d.restaurant.photo,
      onClick: () => push({ name: "detail", service: "food", storeId: d.restaurant.id }),
    })),
  ];

  const matchingRestaurants = RESTAURANTS.filter((r) => {
    const matchesSearch =
      !search.trim() ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisines.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
      r.menu.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      !activeCategory ||
      r.cuisines.some((c) => c.toLowerCase() === activeCategory.toLowerCase());

    const matchesLiked =
      !filterOnlyLiked ||
      state.favorites.includes(r.id) ||
      r.menu.some((m) => state.favorites.includes(m.id));

    return matchesSearch && matchesCategory && matchesLiked;
  });

  const handleApplyPromo = (code: string) => {
    applyPromo("food", code);
    showToast(`Promo code ${code} applied to your food cart!`);
  };

  return (
    <>
      <section
        className="hero food-hero"
        style={{ backgroundImage: `url(${PHOTOS.food})` }}
      >
        <Header dark />
        <ServiceTabs service="food" onSelect={handleSelectService} />
        <div className="hero-copy">
          <p>{serviceMeta.food.kicker}</p>
          <h1>
            Delicious food,
            <br />
            delivered fast.
          </h1>
        </div>
      </section>

      <div className="home-body food-body">
        <SearchBar
          placeholder="Search dishes or restaurants"
          value={search}
          onChange={setSearch}
          onFilter={() => setShowMoreCuisines((v) => !v)}
        />

        {/* Your Favorites Section */}
        {favoritePreviews.length > 0 && (
          <div style={{ marginTop: 14, marginBottom: 8 }}>
            <div className="section-heading" style={{ margin: "10px 0 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#ff5232", fontSize: 13 }}>❤️</span>
                <h2>Your favorites</h2>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    background: "#381c16",
                    color: "var(--accent)",
                    padding: "2px 7px",
                    borderRadius: 10,
                  }}
                >
                  {favoritePreviews.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => push({ name: "favorites" })}
              >
                See all
              </button>
            </div>

            <div className="home-fav-slider">
              {favoritePreviews.map((fav) => (
                <div
                  key={fav.id}
                  className="home-fav-card"
                  onClick={fav.onClick}
                >
                  <div
                    className="thumb"
                    style={{ backgroundImage: `url(${fav.photo})` }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.55)",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "grid",
                        placeItems: "center",
                        color: "#ff5232",
                      }}
                    >
                      <Icon name="heart" size={12} filled />
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 5,
                        left: 6,
                        background: "rgba(0,0,0,0.65)",
                        borderRadius: 4,
                        padding: "2px 5px",
                        fontSize: 7.5,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {fav.tag}
                    </span>
                  </div>
                  <strong>{fav.title}</strong>
                  <small>{fav.subtitle}</small>
                  <b>{fav.meta}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section-heading">
          <h2>What are you craving?</h2>
        </div>

        <div className="categories">
          {FOOD_CATEGORIES.map(({ icon, label }) => {
            const selected = activeCategory === label;
            return (
              <button
                key={label}
                type="button"
                className={selected ? "selected" : ""}
                onClick={() => setActiveCategory(selected ? null : label)}
              >
                <span>{icon}</span>
                <small>{label}</small>
              </button>
            );
          })}
          <button
            type="button"
            className={showMoreCuisines ? "selected" : ""}
            onClick={() => setShowMoreCuisines((v) => !v)}
          >
            <span>＋</span>
            <small>More</small>
          </button>
        </div>

        {showMoreCuisines && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 12,
              padding: "10px 12px",
              background: "#2a1510",
              borderRadius: 12,
            }}
          >
            {MORE_CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                onClick={() => {
                  setActiveCategory(activeCategory === cuisine ? null : cuisine);
                }}
                style={{
                  fontSize: 11,
                  padding: "4px 9px",
                  borderRadius: 8,
                  background: activeCategory === cuisine ? "var(--accent)" : "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              >
                {cuisine}
              </button>
            ))}
          </div>
        )}

        <div className="section-heading" style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2>Popular near you</h2>
            {state.favorites.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterOnlyLiked((v) => !v)}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 12,
                  border: filterOnlyLiked ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.2)",
                  background: filterOnlyLiked ? "var(--accent)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ❤️ Liked ({state.favorites.length})
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (search || activeCategory || filterOnlyLiked) {
                setSearch("");
                setActiveCategory(null);
                setFilterOnlyLiked(false);
              } else {
                push({ name: "restaurantsList" });
              }
            }}
          >
            {search || activeCategory || filterOnlyLiked ? "Reset filter" : "See all"}
          </button>
        </div>

        {matchingRestaurants.length > 0 ? (
          <div style={{ display: "grid", gap: 14 }}>
            {matchingRestaurants.map((restaurant) => {
              const isFav = state.favorites.includes(restaurant.id);
              return (
                <button
                  key={restaurant.id}
                  type="button"
                  className="restaurant-card"
                  onClick={() =>
                    push({ name: "detail", service: "food", storeId: restaurant.id })
                  }
                >
                  <div
                    className="restaurant-photo"
                    style={{ backgroundImage: `url(${restaurant.photo})` }}
                  >
                    <span className="discount">{restaurant.discount}</span>
                    <span
                      className="heart"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(restaurant.id);
                      }}
                    >
                      <Icon
                        name="heart"
                        size={17}
                        filled={isFav}
                      />
                    </span>
                    <p>{restaurant.etaShort}</p>
                  </div>
                  <div className="restaurant-info">
                    <div>
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.cuisines.join(" · ")}</p>
                    </div>
                    <span className="rating">
                      <Icon name="star" size={11} filled /> {restaurant.rating}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "30px 10px",
              textAlign: "center",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600 }}>
              No restaurants matching "{search || activeCategory}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
              style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700 }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="section-heading">
          <h2>Offers for you</h2>
        </div>

        <div className="offers">
          <article
            onClick={() => handleApplyPromo("WELCOME50")}
            style={{ cursor: "pointer" }}
          >
            <span>FIRST ORDER</span>
            <strong>Flat 50% off</strong>
            <small>Tap to apply WELCOME50</small>
          </article>
          <article
            onClick={() => showToast("Free delivery is already applied on all orders!")}
            style={{ cursor: "pointer" }}
          >
            <span>FREE DELIVERY</span>
            <strong>Weekend treat</strong>
            <small>Active on all orders</small>
          </article>
        </div>
      </div>
    </>
  );
}

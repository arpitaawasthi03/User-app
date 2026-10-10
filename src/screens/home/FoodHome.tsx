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

export default function FoodHome() {
  const { push } = useNav();
  const { setService, state, toggleFavorite, applyPromo, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMoreCuisines, setShowMoreCuisines] = useState(false);

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const restaurant = RESTAURANTS[0];
  const isFavorite = state.favorites.includes(restaurant.id);

  const matchesSearch =
    !search.trim() ||
    restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
    restaurant.cuisines.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
    restaurant.menu.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const matchesCategory =
    !activeCategory ||
    restaurant.cuisines.some((c) => c.toLowerCase() === activeCategory.toLowerCase());

  const isVisible = matchesSearch && matchesCategory;

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
                onClick={() => setActiveCategory(selected ? null : label)}
                style={
                  selected
                    ? { outline: "2px solid var(--accent)", borderRadius: "50%" }
                    : undefined
                }
              >
                <span>{icon}</span>
                <small style={selected ? { color: "#fff", fontWeight: 700 } : undefined}>
                  {label}
                </small>
              </button>
            );
          })}
          <button
            type="button"
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

        <div className="section-heading">
          <h2>Popular near you</h2>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
            }}
          >
            {search || activeCategory ? "Reset filter" : "See all"}
          </button>
        </div>

        {isVisible ? (
          <button
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
                  filled={isFavorite}
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

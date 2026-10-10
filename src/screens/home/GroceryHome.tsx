import { useState } from "react";
import Header from "../../components/Header";
import ServiceTabs from "../../components/ServiceTabs";
import SearchBar from "../../components/SearchBar";
import Icon from "../../components/Icon";
import {
  GROCERY_CATEGORIES,
  PHOTOS,
  PRODUCTS,
  type Service,
} from "../../data/demo";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { rupees } from "../../lib/pricing";

export default function GroceryHome() {
  const { push } = useNav();
  const { setService, state, toggleFavorite, addToCart, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !activeCategory || p.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(
      "grocery",
      {
        id: product.id,
        name: product.name,
        subtitle: `${product.unit} · Fresh essentials`,
        price: product.price,
      },
      "roadrider-grocery"
    );
    showToast(`Added ${product.name} to grocery basket`);
  };

  return (
    <div className="grocery-page">
      <Header />
      <ServiceTabs service="grocery" onSelect={handleSelectService} />

      <section
        className="grocery-hero"
        style={{ backgroundImage: `url(${PHOTOS.grocery})` }}
      >
        <div>
          <p>FARM FRESH · EVERYDAY</p>
          <h1>
            Fresh groceries
            <br />
            at your doorstep.
          </h1>
          <span>Delivery in 15 minutes</span>
        </div>
      </section>

      <SearchBar
        placeholder="Search 10,000+ products"
        value={search}
        onChange={setSearch}
        onFilter={() => showToast("Showing all farm-fresh grocery categories.")}
      />

      <div className="section-heading">
        <h2>Shop by category</h2>
        <button
          type="button"
          onClick={() => {
            setActiveCategory(null);
            setSearch("");
          }}
        >
          {activeCategory ? "Show all" : "See all"}
        </button>
      </div>

      <div className="categories grocery-categories">
        {GROCERY_CATEGORIES.map(({ abbr, label }) => {
          const isSelected = activeCategory === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveCategory(isSelected ? null : label)}
              style={
                isSelected
                  ? { outline: "2px solid var(--accent)", borderRadius: "50%" }
                  : undefined
              }
            >
              <span>{abbr}</span>
              <small style={isSelected ? { color: "#225e39", fontWeight: 700 } : undefined}>
                {label}
              </small>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => showToast("Explore more: Bakery, Beverages, Personal Care")}
        >
          <span>＋</span>
          <small>More</small>
        </button>
      </div>

      <article className="green-banner">
        <div>
          <small>FRESH & HEALTHY</small>
          <strong>Up to 30% off</strong>
          <button
            type="button"
            onClick={() => push({ name: "detail", service: "grocery" })}
          >
            Shop now <Icon name="arrow" size={14} />
          </button>
        </div>
        <img src={PHOTOS.produce} alt="Fresh vegetables" />
      </article>

      <div className="section-heading">
        <h2>Daily essentials</h2>
        <button
          type="button"
          onClick={() => push({ name: "detail", service: "grocery" })}
        >
          View basket
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((p, i) => {
          const isFav = state.favorites.includes(p.id);
          const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          return (
            <article key={p.name}>
              <div
                className="product-photo"
                style={{
                  backgroundImage: `url(${i % 2 === 0 ? PHOTOS.grocery : PHOTOS.produce})`,
                }}
              >
                <span>{discountPct}% OFF</span>
                <button
                  type="button"
                  aria-label="Favorite product"
                  onClick={() => toggleFavorite(p.id)}
                >
                  <Icon name="heart" size={16} filled={isFav} />
                </button>
              </div>
              <h3>{p.name}</h3>
              <small>{p.unit}</small>
              <div>
                <b>{rupees(p.price)}</b>
                <del>{rupees(p.mrp)}</del>
                <button
                  type="button"
                  aria-label={`Add ${p.name}`}
                  onClick={() => handleAddToCart(p)}
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react"
import FlowHeader from "../../components/FlowHeader"
import SearchBar from "../../components/SearchBar"
import Icon from "../../components/Icon"
import { RESTAURANTS, FOOD_CATEGORIES } from "../../data/demo"
import { useNav } from "../../navigation/Navigation"
import { useApp } from "../../state/AppState"

interface RestaurantsListProps {
  cuisine?: string
}

export default function RestaurantsList({ cuisine }: RestaurantsListProps) {
  const { back, push } = useNav()
  const { state, toggleFavorite } = useApp()

  const [search, setSearch] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(
    cuisine ?? null,
  )
  const [sortBy, setSortBy] = useState<"rating" | "eta">("rating")

  const allCuisines = [
    "All",
    ...FOOD_CATEGORIES.map((c) => c.label),
    "South Indian",
  ]

  const filtered = RESTAURANTS.filter((r) => {
    const matchesSearch =
      !search.trim() ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisines.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
      r.menu.some((m) => m.name.toLowerCase().includes(search.toLowerCase()))

    const matchesCuisine =
      !selectedCuisine ||
      selectedCuisine === "All" ||
      r.cuisines.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())

    return matchesSearch && matchesCuisine
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    return parseInt(a.eta) - parseInt(b.eta)
  })

  return (
    <div className="flow-page" style={{ padding: "0 18px 90px" }}>
      <FlowHeader title="All Restaurants" onBack={back} showHelp={false} />

      <SearchBar
        placeholder="Search restaurant or cuisine..."
        value={search}
        onChange={setSearch}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "10px 0",
          scrollbarWidth: "none",
        }}
      >
        {allCuisines.map((c) => {
          const active =
            selectedCuisine === c || (!selectedCuisine && c === "All")
          return (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCuisine(c === "All" ? null : c)}
              style={{
                whiteSpace: "nowrap",
                fontSize: 10,
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 20,
                background: active ? "var(--accent)" : "#ffffff",
                color: active ? "#ffffff" : "var(--ink)",
                border: active ? "none" : "1px solid var(--line)",
              }}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "8px 0 14px",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        <span>{filtered.length} places near Hazratganj</span>
        <button
          type="button"
          onClick={() => setSortBy(sortBy === "rating" ? "eta" : "rating")}
          style={{ fontWeight: 700, color: "var(--accent)" }}
        >
          Sort: {sortBy === "rating" ? "Top Rated" : "Fastest Delivery"} ▾
        </button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map((restaurant) => {
          const isFav = state.favorites.includes(restaurant.id)
          return (
            <article
              key={restaurant.id}
              onClick={() =>
                push({
                  name: "detail",
                  service: "food",
                  storeId: restaurant.id,
                })
              }
              style={{
                background: "#ffffff",
                border: "1px solid var(--line)",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  height: 140,
                  backgroundImage: `url(${restaurant.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  padding: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#ffffff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 6,
                  }}
                >
                  {restaurant.discount}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(restaurant.id)
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    color: isFav ? "#c84b31" : "#777",
                  }}
                >
                  <Icon name="heart" size={16} filled={isFav} />
                </button>
              </div>

              <div style={{ padding: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14 }}>
                      {restaurant.name}
                    </h3>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 10,
                        color: "var(--muted)",
                      }}
                    >
                      {restaurant.cuisines.join(" · ")}
                    </p>
                  </div>
                  <span
                    style={{
                      background: "#288153",
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 7px",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Icon name="star" size={10} filled /> {restaurant.rating}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid var(--line)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "var(--muted)",
                  }}
                >
                  <span>🕒 {restaurant.eta} delivery</span>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                    View Menu →
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

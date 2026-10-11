import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import FlowHeader from "../../components/FlowHeader";
import Icon from "../../components/Icon";
import {
  PRODUCTS,
  RESTAURANTS,
  type MenuItem,
  type Restaurant,
} from "../../data/demo";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { colors, radii } from "../../theme/tokens";

export default function Favorites() {
  const { push, switchTab } = useNav();
  const { state, toggleFavorite, addToCart, showToast, setService } = useApp();
  const [activeTab, setActiveTab] = useState<
    "all" | "dishes" | "restaurants" | "groceries"
  >("all");

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
    favoriteRestaurants.length +
    favoriteDishes.length +
    favoriteGroceries.length;

  const handleAddDish = (dish: MenuItem, restaurant: Restaurant) => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlowHeader title="Your Favorites" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTitleBlock}>
          <Text style={styles.eyebrow}>SAVED & LIKED ITEMS</Text>
          <Text style={styles.mainTitle}>Everything you love</Text>
          <Text style={styles.subTitle}>
            Quickly reorder your favorite meals, top restaurants, and everyday
            essentials.
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            style={[
              styles.tabPill,
              activeTab === "all" && styles.tabPillActive,
            ]}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === "all" && styles.tabPillTextActive,
              ]}
            >
              All ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("dishes")}
            style={[
              styles.tabPill,
              activeTab === "dishes" && styles.tabPillActive,
            ]}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === "dishes" && styles.tabPillTextActive,
              ]}
            >
              Dishes ({favoriteDishes.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("restaurants")}
            style={[
              styles.tabPill,
              activeTab === "restaurants" && styles.tabPillActive,
            ]}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === "restaurants" && styles.tabPillTextActive,
              ]}
            >
              Restaurants ({favoriteRestaurants.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("groceries")}
            style={[
              styles.tabPill,
              activeTab === "groceries" && styles.tabPillActive,
            ]}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === "groceries" && styles.tabPillTextActive,
              ]}
            >
              Groceries ({favoriteGroceries.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {totalCount === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyHeartBox}>
              <Icon name="heart" size={32} color={colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No favorites saved yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart icon on any dish, restaurant, or grocery item to keep
              it handy here.
            </Text>
            <View style={styles.emptyBtnRow}>
              <TouchableOpacity
                onPress={() => {
                  setService("food");
                  switchTab("home");
                }}
                style={styles.browseFoodBtn}
              >
                <Text style={styles.browseFoodBtnText}>Browse Food</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setService("grocery");
                  switchTab("home");
                }}
                style={styles.browseGroceryBtn}
              >
                <Text style={styles.browseGroceryBtnText}>
                  Browse Groceries
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.favoritesGrid}>
            {/* Favorite Dishes */}
            {(activeTab === "all" || activeTab === "dishes") &&
              favoriteDishes.map(({ dish, restaurant }) => (
                <View key={dish.id} style={styles.dishCard}>
                  <View style={styles.dishIconBox}>
                    <Icon name="food" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.dishInfo}>
                    <View style={styles.dishBadgeRow}>
                      <View style={styles.dishTagBadge}>
                        <Text style={styles.dishTagText}>DISH</Text>
                      </View>
                      <Text style={styles.dishRestaurantName}>
                        {restaurant.name}
                      </Text>
                    </View>
                    <Text style={styles.dishTitle} numberOfLines={1}>
                      {dish.name}
                    </Text>
                    <Text style={styles.dishDesc} numberOfLines={1}>
                      {dish.description}
                    </Text>
                    <Text style={styles.dishPrice}>
                      {dish.portions && dish.portions.length > 0
                        ? `From ${rupees(dish.portions[0].price)}`
                        : rupees(dish.price)}
                    </Text>
                  </View>

                  <View style={styles.dishActionCol}>
                    <TouchableOpacity
                      onPress={() => {
                        toggleFavorite(dish.id);
                        showToast(`Removed ${dish.name} from favorites`);
                      }}
                      style={styles.heartBtn}
                    >
                      <Icon
                        name="heart"
                        size={18}
                        filled
                        color={colors.accent}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAddDish(dish, restaurant)}
                      style={styles.dishAddBtn}
                    >
                      <Text style={styles.dishAddBtnText}>
                        {dish.portions?.length ? "Options +" : "Add +"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            {/* Favorite Restaurants */}
            {(activeTab === "all" || activeTab === "restaurants") &&
              favoriteRestaurants.map((restaurant) => (
                <View key={restaurant.id} style={styles.restaurantCard}>
                  <View style={styles.restaurantCover}>
                    <Image
                      source={{ uri: restaurant.photo }}
                      style={styles.restaurantImage}
                      resizeMode="cover"
                    />
                    <View style={styles.restaurantCoverOverlay} />
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {restaurant.discount}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        toggleFavorite(restaurant.id);
                        showToast(
                          `Removed ${restaurant.name} from favorites`
                        );
                      }}
                      style={styles.restaurantHeartBtn}
                    >
                      <Icon
                        name="heart"
                        size={16}
                        filled
                        color={colors.accent}
                      />
                    </TouchableOpacity>

                    <View style={styles.coverBottomInfo}>
                      <Text style={styles.coverMeta}>
                        ⭐ {restaurant.rating} · {restaurant.eta}
                      </Text>
                      <View style={styles.restaurantTagBadge}>
                        <Text style={styles.restaurantTagText}>
                          RESTAURANT
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.restaurantCardBody}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.restCardTitle}>
                        {restaurant.name}
                      </Text>
                      <Text style={styles.restCardCuisines}>
                        {restaurant.cuisines.join(" · ")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setService("food");
                        push({
                          name: "detail",
                          service: "food",
                          storeId: restaurant.id,
                        });
                      }}
                      style={styles.viewMenuBtn}
                    >
                      <Text style={styles.viewMenuBtnText}>View Menu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            {/* Favorite Groceries */}
            {(activeTab === "all" || activeTab === "groceries") &&
              favoriteGroceries.map((product) => (
                <View key={product.id} style={styles.groceryCard}>
                  <View style={styles.groceryIconBox}>
                    <Icon name="bag" size={24} color="#2e7d32" />
                  </View>
                  <View style={styles.groceryInfo}>
                    <View style={styles.dishBadgeRow}>
                      <View style={styles.groceryTagBadge}>
                        <Text style={styles.groceryTagText}>GROCERY</Text>
                      </View>
                      <Text style={styles.dishRestaurantName}>
                        15 min express
                      </Text>
                    </View>
                    <Text style={styles.dishTitle}>{product.name}</Text>
                    <Text style={styles.dishDesc}>
                      {product.unit} · Fresh daily stock
                    </Text>
                    <Text style={styles.groceryPrice}>
                      {rupees(product.price)}
                    </Text>
                  </View>

                  <View style={styles.dishActionCol}>
                    <TouchableOpacity
                      onPress={() => {
                        toggleFavorite(product.id);
                        showToast(`Removed ${product.name} from favorites`);
                      }}
                      style={styles.heartBtn}
                    >
                      <Icon
                        name="heart"
                        size={18}
                        filled
                        color={colors.accent}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAddGrocery(product)}
                      style={styles.groceryAddBtn}
                    >
                      <Text style={styles.groceryAddBtnText}>Add +</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 90,
  },
  headerTitleBlock: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4,
  },
  subTitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
  tabsScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  tabPillTextActive: {
    color: "#ffffff",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
  },
  emptyHeartBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },
  emptySub: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
    marginVertical: 10,
    maxWidth: 240,
    lineHeight: 16,
  },
  emptyBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  browseFoodBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseFoodBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  browseGroceryBtn: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseGroceryBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  favoritesGrid: {
    gap: 12,
  },
  dishCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dishIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  dishInfo: {
    flex: 1,
  },
  dishBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  dishTagBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dishTagText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.accent,
  },
  dishRestaurantName: {
    fontSize: 10,
    color: colors.muted,
  },
  dishTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  dishDesc: {
    fontSize: 10,
    color: colors.muted,
    marginVertical: 2,
  },
  dishPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  dishActionCol: {
    alignItems: "flex-end",
    gap: 8,
  },
  heartBtn: {
    padding: 4,
  },
  dishAddBtn: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dishAddBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
  },
  restaurantCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  restaurantCover: {
    height: 110,
    width: "100%",
    position: "relative",
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
  },
  restaurantCoverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
  },
  restaurantHeartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverBottomInfo: {
    position: "absolute",
    bottom: 8,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverMeta: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  restaurantTagBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  restaurantTagText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "700",
  },
  restaurantCardBody: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  restCardCuisines: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  viewMenuBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewMenuBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  groceryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groceryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#eef7f0",
    alignItems: "center",
    justifyContent: "center",
  },
  groceryInfo: {
    flex: 1,
  },
  groceryTagBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  groceryTagText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#2e7d32",
  },
  groceryPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2e7d32",
  },
  groceryAddBtn: {
    borderWidth: 1.5,
    borderColor: "#2e7d32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  groceryAddBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2e7d32",
  },
});

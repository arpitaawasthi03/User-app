import { supabase } from "./supabase";
import { PRODUCTS, type Product } from "../data/demo";

/**
 * Service helpers for Supabase backend data.
 *
 * Confirmed Supabase tables in project:
 * - products (id, name, description, price, mrp, unit, category_id, store_id, image_url, is_available)
 * - stores (id, description, vendor_id, rating, status, phone, email)
 * - vendors (id, business_name, phone, email, user_id)
 * - customers / profiles (id, full_name, phone, email)
 * - offers (id, code, description, is_active, valid_until)
 * - reviews (id, store_id, order_id, rating, comment)
 * - notifications (id, title, store_id, vendor_id, created_at)
 * - orders / order_items
 */

/**
 * Fetches real products from the confirmed Supabase `products` table.
 * Falls back to demo fixtures if the database table is empty or unconfigured.
 */
export async function fetchGroceryProducts(): Promise<Product[]> {
  if (!supabase) return PRODUCTS;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, mrp, unit, category_id, image_url, is_available")
      .eq("is_available", true);

    if (error) {
      console.warn("[Supabase] Query error for products:", error.message);
      return PRODUCTS;
    }

    if (!data || data.length === 0) {
      // Backend table confirmed and reachable, but currently contains 0 records.
      return PRODUCTS;
    }

    return data.map((d) => ({
      id: String(d.id),
      name: d.name || "Product",
      unit: d.unit || "1 unit",
      price: Number(d.price) || 0,
      mrp: Number(d.mrp) || Number(d.price) || 0,
      category: d.category_id || "Veggies",
      photo: d.image_url || "",
    }));
  } catch (err) {
    console.warn("[Supabase] Failed to fetch products, using fallback", err);
    return PRODUCTS;
  }
}

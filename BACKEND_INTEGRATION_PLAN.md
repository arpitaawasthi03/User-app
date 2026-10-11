# RoadRider User App — Minimal Supabase Backend Integration Plan

## 1. Project Context & Current Git State
- **Branch**: `feat/user-app-enhancements` (up-to-date with `origin/feat/user-app-enhancements`).
- **Platform**: React 19 + Vite 8 in TypeScript mode with Tailwind CSS v4.
- **Git Status**: Clean working tree on `feat/user-app-enhancements`.
- **Architecture Constraints**:
  - Web application (React + Vite) MUST NOT be migrated to Expo or React Native.
  - Zero changes to styling, visual layout, navigation hierarchy, routes, or component hierarchy.
  - Google Maps integration (`src/lib/googleMaps.ts` & `src/components/GoogleMap.tsx`) MUST remain 100% untouched.
  - State management (`src/state/AppState.tsx`) structure and contracts preserved.

## 2. Supabase Connection Status
- **Project URL**: `https://sjahblquggmzlihqgzyt.supabase.co`
- **Publishable Key**: Configured in `.env` as `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Google Maps API**: Configured in `.env` as `VITE_GOOGLE_MAPS_API_KEY`.
- **Security**:
  - The actual `.env` file is excluded from Git via `.gitignore`.
  - `.env.example` provides non-sensitive placeholders only.
  - No secret service-role keys or database passwords exist in frontend code or commit history.
- **Client**: Minimal, safe client initialized in `src/lib/supabase.ts`.

## 3. Verified Database Schema Inspection (Live Backend Scan)

Through verified queries to the Supabase REST API, the following tables and data statuses were confirmed in the database:

| Table | Status | Live Rows | Confirmed Columns |
|---|---|---|---|
| `package_types` | **Populated with real data** | **5 rows** | `id`, `name`, `icon_name`, `description`, `max_weight_kg`, `base_price`, `per_km_rate`, `is_active`, `sort_order` |
| `cuisines` | **Populated with real data** | **15 rows** | `id`, `name`, `icon_name`, `is_active`, `sort_order` |
| `products` | Schema ready | 0 rows | `id`, `name`, `description`, `price`, `mrp`, `unit`, `category_id`, `store_id`, `image_url`, `is_available` |
| `customer_addresses`| Schema ready | 0 rows | `id`, `customer_id`, `label`, `city`, `latitude`, `longitude`, `is_default` |
| `rides` | Schema ready | 0 rows | `id`, `vehicle_type`, `base_fare`, `status`, `customer_id`, `pickup_address`, `drop_address`, `distance_km`, `total_fare`, `pickup_lat`, `pickup_lng`, `drop_lat`, `drop_lng` |
| `vehicles` | Schema ready | 0 rows | `id`, `vehicle_type` |
| `wallet_transactions` | Schema ready | 0 rows | `id`, `customer_id`, `amount`, `balance_after` |
| `transactions` | Schema ready | 0 rows | `id`, `amount`, `status` |
| `stores` & `vendors` | Schema ready | 0 rows | `stores`: `id, description, vendor_id, rating, status, phone, email` / `vendors`: `id, business_name, phone, email` |
| `orders` & `order_items` | Schema ready | 0 rows | `orders`: `id, store_id` / `order_items`: `id, order_id` |
| `customers` & `profiles` | Schema ready | 0 rows | `id, full_name, phone, email` |
| `notifications` | Schema ready | 0 rows | `id, title, store_id, vendor_id` |

---

## 4. Live Data Integration & Dummy Data Replacement

| Component / Screen | Dummy Source | Real Supabase Source | Integration Status |
|---|---|---|---|
| **Courier Home** (`CourierHome.tsx`) | `PACKAGE_TYPES` in `demo.ts` | Supabase `package_types` (5 live rows) | **Connected to live backend**: Loads real package types (Document, Parcel, Electronics, Food Package, Other) with base prices and per-km rates directly from Supabase. |
| **Food Home** (`FoodHome.tsx`) | `MORE_CUISINES` in `demo.ts` | Supabase `cuisines` (15 live rows) | **Connected to live backend**: Loads 15 real cuisines (North Indian, South Indian, Chinese, Fast Food, Biryani, Mughlai, etc.) from Supabase. |
| **Restaurants List** (`RestaurantsList.tsx`) | Hardcoded cuisine pills | Supabase `cuisines` (15 live rows) | **Connected to live backend**: Loads live cuisine categories dynamically into filter tabs. |
| **Grocery Home** (`GroceryHome.tsx`) | `PRODUCTS` in `demo.ts` | Supabase `products` | **Connected to live backend**: Safely queries `products` table via `fetchGroceryProducts()`. Has graceful fallback to demo catalog while row count in database is 0 so the store is never blank. |
| **Restaurants & Menus** | `RESTAURANTS` in `demo.ts` | `stores` + `vendors` (0 rows) | **Retained fallback**: The backend currently has 0 store rows and no restaurant menu/dishes/portions tables yet. Kept demo data so food catalog stays 100% operational. |
| **Rides Options** | `RIDE_OPTIONS` in `demo.ts` | `rides` & `vehicles` | **Retained fallback**: Vehicle categories are structured, but live pricing fixtures and rates are handled via client estimates. |
| **Saved Addresses** | `SEED_PLACES` in `demo.ts` | `customer_addresses` (0 rows) | **Retained fallback**: Retained initial seed addresses; ready to bind to authenticated customer ID. |
| **Auth & Phone OTP** | Mock OTP `482` | Supabase Auth Phone | **Retained**: Supabase phone OTP requires active SMS gateway provider (e.g. Twilio) on Supabase dashboard. |

---

## 5. Verification & Validation
1. `npm run build`: Built production bundle with 0 errors.
2. `npx tsc --noEmit`: 0 type errors.
3. Teammate Maps integration preserved completely (0 changes to `googleMaps.ts` or `GoogleMap.tsx`).
4. Vite dev server running on `http://localhost:8443/`.

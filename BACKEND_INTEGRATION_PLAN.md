# RoadRider User App — Minimal Supabase Backend Integration Plan

## 1. Project Context & Current Git State
- **Branch**: `feat/user-app-enhancements` (up-to-date with `origin/feat/user-app-enhancements`).
- **Platform**: React 19 + Vite 8 in TypeScript mode with Tailwind CSS v4.
- **Git Status**: Clean working tree on `feat/user-app-enhancements` (no uncommitted modifications).
- **Architecture Constraints**:
  - Web application (React + Vite) MUST NOT be migrated to Expo or React Native.
  - Zero changes to styling, visual layout, navigation hierarchy, routes, or component hierarchy.
  - Google Maps integration (`src/lib/googleMaps.ts` & `src/components/GoogleMap.tsx`) MUST remain 100% untouched.
  - State management (`src/state/AppState.tsx`) structure and contracts preserved.

## 2. Supabase Connection Status
- **Project URL**: `https://sjahblquggmzlihqgzyt.supabase.co`
- **Publishable Key**: Configured in `.env` as `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Security**:
  - The actual `.env` file is excluded from Git via `.gitignore`.
  - `.env.example` provides non-sensitive placeholders only.
  - No secret service-role keys or database passwords exist in frontend code or commit history.
- **Client**: Minimal, safe client initialized in `src/lib/supabase.ts`.

## 3. Confirmed Database Schema Inspection

Through verified access to the Supabase REST API with the project's publishable key, the following tables and column definitions were confirmed in the database:

| Table | Confirmed Columns | Current Row Count | RLS Status |
|---|---|---|---|
| `products` | `id`, `name`, `description`, `price`, `mrp`, `unit`, `category_id`, `store_id`, `image_url`, `is_available`, `created_at`, `updated_at` | 0 rows | Enabled |
| `stores` | `id`, `description`, `vendor_id`, `rating`, `status`, `phone`, `email`, `created_at`, `updated_at` | 0 rows | Enabled |
| `vendors` | `id`, `business_name`, `phone`, `email`, `user_id`, `created_at`, `updated_at` | 0 rows | Enabled |
| `customers` | `id`, `full_name`, `phone`, `email`, `created_at`, `updated_at` | 0 rows | Enabled |
| `profiles` | `id`, `phone`, `email`, `full_name`, `created_at`, `updated_at` | 0 rows | Enabled |
| `offers` | `id`, `code`, `description`, `is_active`, `valid_until`, `created_at`, `updated_at` | 0 rows | Enabled |
| `reviews` | `id`, `store_id`, `order_id`, `rating`, `comment`, `created_at`, `updated_at` | 0 rows | Enabled |
| `notifications` | `id`, `title`, `store_id`, `vendor_id`, `created_at` | 0 rows | Enabled |
| `orders` | `id`, `store_id`, `created_at`, `updated_at` | 0 rows | Enabled |
| `order_items` | `id`, `order_id`, `created_at`, `updated_at` | 0 rows | Enabled |

### Tables NOT present in database:
- `restaurants`: (The backend schema organizes merchants under `stores` and `vendors`, but has no restaurant menu, cuisines, portion, or addon tables).
- `rides` / `ride_options` / `vehicles`: (No tables exist for ride categories or pricing).
- `couriers` / `packages` / `parcels`: (No tables exist for courier packages).
- `places` / `addresses`: (No table for customer saved addresses).
- `wallets` / `wallet_transactions`: (No table for user wallet balances).

## 4. Audit of Dummy Data Sources & Integration Strategy

| Dummy Data Fixture | Consuming Screens & Components | Real Backend Equivalent | Action Taken |
|---|---|---|---|
| `PRODUCTS` | `GroceryHome.tsx`, `StoreDetail.tsx`, `Favorites.tsx`, `AppState.tsx` | Supabase `products` table | **Integrated**: Added `fetchGroceryProducts()` service in `src/lib/supabaseData.ts`. Connected to `GroceryHome.tsx` to query live `products`. If table is empty (0 rows), it safely falls back to demo items so UI and checkout never break. |
| `RESTAURANTS` & `menu` | `FoodHome.tsx`, `RestaurantsList.tsx`, `StoreDetail.tsx`, `DeliveryDetails.tsx`, `OrderStatus.tsx`, `Favorites.tsx` | Partial (`stores` + `vendors` exist, but no menus, dishes, cuisines, or coordinates schema) | **Retained**: Do not invent speculative restaurant schema. |
| `RIDE_OPTIONS`, `RENTAL_PACKAGES` | `RidesHome.tsx`, `RideConfirm.tsx`, `AppState.tsx` | None in database | **Retained**: Preserved demo fixtures. |
| `PACKAGE_TYPES` | `CourierHome.tsx`, `Cart.tsx`, `AppState.tsx` | None in database | **Retained**: Preserved demo fixtures. |
| `SEED_PLACES` | `Places.tsx`, `AddAddress.tsx`, `AppState.tsx` | None in database | **Retained**: Preserved demo places. |
| Seeded Orders & History | `Orders.tsx`, `OrderDetail.tsx`, `OrderStatus.tsx` | `orders` table exists (0 rows, financial operations require backend RPC) | **Retained**: Retain state until authenticated customer orders flow is established. |
| Mock Auth & OTP (`482`) | `PhoneLogin.tsx`, `OtpVerify.tsx`, `AppState.tsx` | Supabase Auth (unconfigured SMS provider) | **Retained**: Supabase Phone Auth requires Twilio or SMS provider setup before UI flow can be converted. |

## 5. Verification & Acceptance
1. `npm run build` passes with zero errors.
2. `npx tsc --noEmit` passes with zero type errors.
3. Clean Git diff showing only the minimal, necessary additions:
   - `@supabase/supabase-js` added to `package.json`.
   - `src/lib/supabase.ts` and `src/lib/supabaseData.ts`.
   - `.env.example` and `.gitignore`.
   - `src/vite-env.d.ts`.
   - `src/screens/home/GroceryHome.tsx` connected to Supabase products with safe fallback.
4. All existing screens, navigation, and Maps integration remain 100% functional.

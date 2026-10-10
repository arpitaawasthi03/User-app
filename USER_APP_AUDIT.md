# RoadRider User App — Codebase Audit

## Executive Summary
This document provides an audit of the initial RoadRider customer web application codebase before full modularization and implementation of the user flows discovered from the Figma reference ([https://stair-linked-07705176.figma.site/](https://stair-linked-07705176.figma.site/)).

## 1. Project Architecture & Framework Detected
- **Environment**: React 19 + Vite 8 in TypeScript mode (specifically a Figma Make web application scaffold).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin and custom CSS classes declared in `src/index.css`.
- **Fonts**: DM Sans (body) & Poppins (headings/branding), imported from Google Fonts.
- **Runtime Target**: Web browser targeting mobile viewports (~390px - 430px) with responsive framing.
- **Dependencies**:
  - `react`: `^19.0.0`
  - `react-dom`: `^19.0.0`
  - `@tailwindcss/vite`: `^4.0.0`
  - `tailwindcss`: `^4.0.0`
  - `vite`: `^8.0.5`
  - `typescript`: `^5.7.0`
  - `oxfmt`: `^0.2.0`
- **Initial Git / Workspace Status**:
  - Unversioned standalone directory (not a git repository).
  - A clean backup copy of original files (`App.tsx`, `index.css`, `main.tsx`) was created at `reference/original-src/` before modification.

## 2. Existing Screens & Functionality in Original `src/App.tsx`
Before changes, `src/App.tsx` was a monolithic single-file prototype (433 lines) consisting of:
- **Splash (`Splash`)**: Hero screen with photo background and "Get started" button.
- **Auth Screen (`AuthScreen`)**:
  - Step 1: Phone input (`98765 43210`) with hardcoded "Send OTP".
  - Step 2: OTP verification with hardcoded digits `482` and an on-screen keypad.
- **Home Screens**:
  - `FoodHome`: Hero banner, search bar, categories, single restaurant card, offers.
  - `RidesHome`: Segment toggle ("Book a ride" / "Hourly rental"), SVG map illustration, pickup/destination, 4 vehicle types, booking CTA.
  - `GroceryHome`: Hero banner, categories, discount card, 2 product cards with add button.
  - `CourierHome`: Hero banner, send/track segment, pickup/delivery rows, 4 package types, price estimate, trust icons.
- **Flow / Detail Screens**:
  - `ServiceDetail`: Single detail layout for food restaurant, grocery basket, or courier quote.
  - `CheckoutScreen`: Handled cart, address selection, payment options, confirmation, tracking, and completion.
- **Utility / Tab Screens**:
  - `NavCart`: Bottom-nav cart summary.
  - `WalletScreen`: Wallet balance, quick actions, recent transactions list, linked card.
  - `OrdersScreen`: Tabbed active and past orders across 4 services.
  - `Account`: Profile header, wallet shortcut, order preview, settings menu.
  - `MoreScreen`: Generic fallback screen triggered by catching unhandled button clicks via an event bubbling listener on `.app-shell`.

## 3. Discovered Shortcomings & Implementation Gaps
1. **Monolithic Architecture**: All screen states, mock copy, SVG icons, and routing were clumped into `src/App.tsx`.
2. **Artificial Catch-all Router**: An `onClick` listener on `.app-shell` inspected click targets and opened a generic `MoreScreen` whenever an unhandled button was tapped. Real user journeys (e.g. adding addresses, changing quantities, applying promos, searching, managing payment methods) were unfulfilled.
3. **Hardcoded Billing**: Bill values did not dynamically calculate taxes or promo discounts based on cart contents.
4. **No Real Cart Store**: Food and grocery lacked a dynamic shopping cart state where items can be added, updated in quantity, or removed.
5. **No Validation**: Phone and OTP inputs accepted arbitrary or empty inputs without verification.
6. **No Search or Filtering**: Search bars and category chips were purely static.
7. **Figma Presentation Artifacts**: The app shell included desktop bezel styling and mock frames intended for Figma prototype viewing rather than a clean production mobile web application.

## 4. Reusable Components & Services Established
- `src/data/demo.ts`: Central demo data containing all Figma reference models (restaurants, items, rides, packages, saved places).
- `src/lib/pricing.ts`: Pricing engine computing item totals, delivery charges, taxes, discounts, and promo validation.
- `src/lib/format.ts`: Date, time, currency, and phone formatting utilities.
- `src/state/AppState.tsx`: Single source of truth React context managing authentication, cart lines, active bookings, orders, wallet transactions, notifications, and saved places with localStorage persistence.
- `src/navigation/Navigation.tsx`: Robust stack and tab navigator with browser history integration (popstate/hardware back support).
- `src/components/Icon.tsx`: Unified SVG icon library matching Figma line graphics.

## 5. Implementation Roadmap
- **Phase 4 & 5**: Build modular, fully interactive screens for Auth, Home (Food, Rides, Grocery, Courier), Checkout Flows, Utility Tabs, and all secondary screens (Places, Add Address, Notifications, Payment Methods, Order Details, Help, Profile, Add Money, Transactions).
- **Phase 6**: Wire up full interactivity: interactive search, cuisine filtering, dynamic cart quantity steppers, promo code sheet, wallet transactions with balance deduction, star ratings, and address creation.
- **Phase 7 & 8**: Integrate safe area padding, responsive scaling, and ensure smooth touch behavior.
- **Phase 9 & 10**: Verify and test all user flows, screen-by-screen, and ensure zero Figma presentation wrapper clutter remains.

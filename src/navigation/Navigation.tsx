import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Service } from "../data/demo";

/** Every destination in the app. See USER_APP_SCREEN_INVENTORY.md for the USER-xxx mapping. */
export type TabName = "home" | "navcart" | "wallet" | "orders" | "account";
export type PlacesMode = "delivery" | "ridePickup" | "rideDrop" | "courierPickup" | "courierDrop" | "manage";

export type Route =
  | { name: "splash" }
  | { name: "phone" }
  | { name: "otp"; phone: string }
  | { name: TabName }
  | { name: "detail"; service: "food" | "grocery" | "courier"; storeId?: string }
  | { name: "rideConfirm" }
  | { name: "cart"; service: Service }
  | { name: "address"; service: Service }
  | { name: "payment"; service: Service }
  | { name: "status"; orderId: string; view: "confirmed" | "tracking" }
  | { name: "complete"; orderId: string }
  | { name: "notifications" }
  | { name: "places"; mode: PlacesMode }
  | { name: "addAddress"; mode: PlacesMode }
  | { name: "paymentMethods" }
  | { name: "help"; orderId?: string }
  | { name: "orderDetail"; orderId: string }
  | { name: "profile" }
  | { name: "addMoney" }
  | { name: "transactions" };

export const TAB_NAMES: TabName[] = ["home", "navcart", "wallet", "orders", "account"];
export const isTab = (r: Route): r is { name: TabName } => (TAB_NAMES as string[]).includes(r.name);

type Nav = {
  stack: Route[];
  current: Route;
  push: (r: Route) => void;
  replace: (r: Route) => void;
  reset: (routes: Route[]) => void;
  back: () => void;
  switchTab: (t: TabName) => void;
};

const NavContext = createContext<Nav | null>(null);

function canGoBack(stack: Route[]) {
  if (stack.length > 1) return true;
  const root = stack[0];
  // A non-home bottom-nav tab goes back to Home (the design has no Home tab item).
  return isTab(root) && root.name !== "home";
}

function popped(stack: Route[]): Route[] {
  if (stack.length > 1) return stack.slice(0, -1);
  const root = stack[0];
  if (isTab(root) && root.name !== "home") return [{ name: "home" }];
  return stack;
}

/**
 * Stack navigator. A single "guard" browser-history entry is kept while the stack can go back so
 * the browser / Android back button pops screens instead of leaving the app.
 */
export function NavigationProvider({ initial, children }: { initial: Route[]; children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>(initial);
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const guardActive = useRef(false);
  const ignoreNextPop = useRef(false);

  useEffect(() => {
    const onPop = () => {
      if (ignoreNextPop.current) { ignoreNextPop.current = false; return; }
      guardActive.current = false;
      if (canGoBack(stackRef.current)) setStack((s) => popped(s));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Keep the guard entry in sync with whether in-app back is possible.
  useEffect(() => {
    const needGuard = canGoBack(stack);
    if (needGuard && !guardActive.current) {
      window.history.pushState({ roadrider: true }, "");
      guardActive.current = true;
    } else if (!needGuard && guardActive.current) {
      guardActive.current = false;
      ignoreNextPop.current = true;
      window.history.back();
    }
  }, [stack]);

  const push = useCallback((r: Route) => setStack((s) => [...s, r]), []);
  const replace = useCallback((r: Route) => setStack((s) => [...s.slice(0, -1), r]), []);
  const reset = useCallback((routes: Route[]) => setStack(routes), []);
  const back = useCallback(() => setStack((s) => popped(s)), []);
  const switchTab = useCallback((t: TabName) => setStack([{ name: t }]), []);

  const value = useMemo<Nav>(() => ({ stack, current: stack[stack.length - 1], push, replace, reset, back, switchTab }), [stack, push, replace, reset, back, switchTab]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavigationProvider");
  return ctx;
}

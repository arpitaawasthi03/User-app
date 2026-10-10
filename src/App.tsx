import { AppStateProvider, useApp } from "./state/AppState";
import { NavigationProvider, useNav, isTab, type Route, type TabName } from "./navigation/Navigation";

import Splash from "./screens/auth/Splash";
import PhoneLogin from "./screens/auth/PhoneLogin";
import OtpVerify from "./screens/auth/OtpVerify";

import FoodHome from "./screens/home/FoodHome";
import RidesHome from "./screens/home/RidesHome";
import GroceryHome from "./screens/home/GroceryHome";
import CourierHome from "./screens/home/CourierHome";

import StoreDetail from "./screens/flow/StoreDetail";
import RideConfirm from "./screens/flow/RideConfirm";
import Cart from "./screens/flow/Cart";
import DeliveryDetails from "./screens/flow/DeliveryDetails";
import Payment from "./screens/flow/Payment";
import OrderStatus from "./screens/flow/OrderStatus";
import OrderComplete from "./screens/flow/OrderComplete";

import NavCart from "./screens/tabs/NavCart";
import Wallet from "./screens/tabs/Wallet";
import Orders from "./screens/tabs/Orders";
import Account from "./screens/tabs/Account";

import Notifications from "./screens/more/Notifications";
import Places from "./screens/more/Places";
import AddAddress from "./screens/more/AddAddress";
import PaymentMethods from "./screens/more/PaymentMethods";
import AddPaymentMethod from "./screens/more/AddPaymentMethod";
import ChatSupport from "./screens/more/ChatSupport";
import RestaurantsList from "./screens/more/RestaurantsList";
import Help from "./screens/more/Help";
import OrderDetail from "./screens/more/OrderDetail";
import Profile from "./screens/more/Profile";
import AddMoney from "./screens/more/AddMoney";
import Transactions from "./screens/more/Transactions";
import Favorites from "./screens/more/Favorites";

import BottomNav from "./components/BottomNav";
import Icon from "./components/Icon";

function AppShell() {
  const { current, switchTab } = useNav();
  const { state, toast } = useApp();

  const cartCount =
    state.carts.food.lines.reduce((sum, l) => sum + l.qty, 0) +
    state.carts.grocery.lines.reduce((sum, l) => sum + l.qty, 0);

  const showBottomNav = isTab(current);

  const renderScreen = () => {
    switch (current.name) {
      case "splash":
        return <Splash />;
      case "phone":
        return <PhoneLogin />;
      case "otp":
        return <OtpVerify phone={current.phone} />;

      case "home":
        switch (state.service) {
          case "food":
            return <FoodHome />;
          case "rides":
            return <RidesHome />;
          case "grocery":
            return <GroceryHome />;
          case "courier":
            return <CourierHome />;
          default:
            return <FoodHome />;
        }

      case "navcart":
        return <NavCart />;
      case "wallet":
        return <Wallet />;
      case "orders":
        return <Orders />;
      case "account":
        return <Account />;

      case "detail":
        return <StoreDetail service={current.service} storeId={current.storeId} />;
      case "rideConfirm":
        return <RideConfirm />;
      case "cart":
        return <Cart service={current.service} />;
      case "address":
        return <DeliveryDetails service={current.service} />;
      case "payment":
        return <Payment service={current.service} />;
      case "status":
        return <OrderStatus orderId={current.orderId} initialView={current.view} />;
      case "complete":
        return <OrderComplete orderId={current.orderId} />;

      case "notifications":
        return <Notifications />;
      case "places":
        return <Places mode={current.mode} />;
      case "addAddress":
        return <AddAddress mode={current.mode} />;
      case "paymentMethods":
        return <PaymentMethods />;
      case "addPaymentMethod":
        return <AddPaymentMethod />;
      case "chatSupport":
        return <ChatSupport orderId={current.orderId} />;
      case "restaurantsList":
        return <RestaurantsList cuisine={current.cuisine} />;
      case "help":
        return <Help orderId={current.orderId} />;
      case "orderDetail":
        return <OrderDetail orderId={current.orderId} />;
      case "profile":
        return <Profile />;
      case "addMoney":
        return <AddMoney />;
      case "transactions":
        return <Transactions />;
      case "favorites":
        return <Favorites />;

      default:
        return <FoodHome />;
    }
  };

  const themeClass = state.service ? `theme-${state.service}` : "theme-food";

  return (
    <div className={`app-shell ${themeClass}`}>
      <div className="mobile-frame">
        <div
          className="screen-scroll"
          style={!showBottomNav ? { paddingBottom: 0 } : undefined}
        >
          {renderScreen()}
        </div>

        {showBottomNav && (
          <BottomNav
            active={current.name as TabName}
            count={cartCount}
            onSelect={(tab) => switchTab(tab)}
          />
        )}

        {toast && (
          <aside className="toast-notification" role="status" aria-live="polite">
            <Icon name="check" size={16} />
            <span>{toast.text}</span>
          </aside>
        )}
      </div>
    </div>
  );
}

function AppWithNavigation() {
  const { state } = useApp();
  const initialRoutes: Route[] = state.authenticated
    ? [{ name: "home" }]
    : [{ name: "splash" }];

  return (
    <NavigationProvider initial={initialRoutes}>
      <AppShell />
    </NavigationProvider>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppWithNavigation />
    </AppStateProvider>
  );
}

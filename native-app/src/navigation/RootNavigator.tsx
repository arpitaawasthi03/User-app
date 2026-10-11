import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import type {
  RootStackParamList,
  BottomTabParamList,
  TabName,
} from "./types";
import { useApp } from "../state/AppState";
import { useNav } from "./Navigation";
import { colors } from "../theme/tokens";

// Auth Screens
import Splash from "../screens/auth/Splash";
import PhoneLogin from "../screens/auth/PhoneLogin";
import OtpVerify from "../screens/auth/OtpVerify";

// Home Screens
import FoodHome from "../screens/home/FoodHome";
import RidesHome from "../screens/home/RidesHome";
import GroceryHome from "../screens/home/GroceryHome";
import CourierHome from "../screens/home/CourierHome";

// Flow Screens
import StoreDetail from "../screens/flow/StoreDetail";
import RideConfirm from "../screens/flow/RideConfirm";
import Cart from "../screens/flow/Cart";
import DeliveryDetails from "../screens/flow/DeliveryDetails";
import Payment from "../screens/flow/Payment";
import OrderStatus from "../screens/flow/OrderStatus";
import OrderComplete from "../screens/flow/OrderComplete";

// Auxiliary Screens
import AddAddress from "../screens/more/AddAddress";
import Help from "../screens/more/Help";
import PaymentMethods from "../screens/more/PaymentMethods";
import AddMoney from "../screens/more/AddMoney";
import Places from "../screens/more/Places";

// Shared Components
import UtilityHeader from "../components/UtilityHeader";
import BillSummary from "../components/BillSummary";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import FlowHeader from "../components/FlowHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Service vertical dispatcher for the Home tab, matching original App.tsx behavior.
 */
function HomeServiceDispatcher() {
  const { state } = useApp();

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
}

function CartTabScreen() {
  const { push } = useNav();
  return (
    <SafeAreaView style={styles.screen}>
      <UtilityHeader title="Your Cart" subtitle="Checkout" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BillSummary service="food" />
        <View style={styles.btnPad}>
          <Button onPress={() => push({ name: "payment", service: "food" })}>
            Proceed to Payment
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WalletTabScreen() {
  const { state } = useApp();
  const { push } = useNav();
  return (
    <SafeAreaView style={styles.screen}>
      <UtilityHeader title="Wallet" subtitle="Balances & Top-up" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardPad}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceValue}>₹{state.wallet.balance}</Text>
          <Button
            secondary
            onPress={() => push({ name: "addMoney" })}
            style={{ marginTop: 14 }}
          >
            + Add Money
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OrdersTabScreen() {
  const { state } = useApp();
  const { push } = useNav();
  return (
    <SafeAreaView style={styles.screen}>
      <UtilityHeader title="Orders" subtitle="Activity" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {state.orders.map((o) => (
          <View key={o.id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderTitle}>{o.title}</Text>
              <Text style={styles.orderPrice}>₹{o.bill.toPay}</Text>
            </View>
            <Text style={styles.orderSub}>{o.subtitle}</Text>
            <Button
              secondary
              onPress={() => push({ name: "orderDetail", orderId: o.id })}
              style={{ height: 38, marginTop: 10 }}
            >
              View Receipt
            </Button>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function AccountTabScreen() {
  const { state, signOut } = useApp();
  const { push } = useNav();
  return (
    <SafeAreaView style={styles.screen}>
      <UtilityHeader title="Account" subtitle="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardPad}>
          <Text style={styles.profileName}>{state.profile.name}</Text>
          <Text style={styles.profileSub}>
            {state.profile.phone || "+91 98765 43210"}
          </Text>
        </View>
        <View style={styles.btnPad}>
          <Button
            secondary
            onPress={() => push({ name: "places", mode: "manage" })}
            style={{ marginBottom: 10 }}
          >
            Saved Addresses
          </Button>
          <Button
            secondary
            onPress={() => push({ name: "paymentMethods" })}
            style={{ marginBottom: 10 }}
          >
            Payment Methods
          </Button>
          <Button
            secondary
            onPress={() => push({ name: "help" })}
            style={{ marginBottom: 10 }}
          >
            Help & Support
          </Button>
          <Button onPress={signOut} style={{ backgroundColor: colors.muted }}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Main Tabs Navigator wrapping the 5 tabs with custom BottomNav
 */
function MainTabsNavigator() {
  const { state } = useApp();
  const cartCount =
    state.carts.food.lines.reduce((sum, l) => sum + l.qty, 0) +
    state.carts.grocery.lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <Tab.Navigator
      tabBar={(props) => {
        const activeRoute = props.state.routes[props.state.index].name as TabName;
        return (
          <BottomNav
            active={activeRoute}
            count={cartCount}
            onSelect={(tab) => props.navigation.navigate(tab)}
          />
        );
      }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="home" component={HomeServiceDispatcher} />
      <Tab.Screen name="navcart" component={CartTabScreen} />
      <Tab.Screen name="wallet" component={WalletTabScreen} />
      <Tab.Screen name="orders" component={OrdersTabScreen} />
      <Tab.Screen name="account" component={AccountTabScreen} />
    </Tab.Navigator>
  );
}

/**
 * Generic Modal/Stack Screen Shell for secondary routes
 */
function GenericScreenShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <FlowHeader title={title} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children ?? (
          <View style={styles.cardPad}>
            <Text style={styles.placeholderText}>
              Native {title} screen ready for Phase 4 implementation.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Root Native Stack Navigator
 */
export default function RootNavigator() {
  const { state } = useApp();
  const initialRoute = state.authenticated ? "mainTabs" : "splash";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="phone" component={PhoneLogin} />
        <Stack.Screen name="otp">
          {({ route }: any) => (
            <OtpVerify phone={route.params?.phone || "9876543210"} />
          )}
        </Stack.Screen>

        {/* Core Main Tab Navigation */}
        <Stack.Screen name="mainTabs" component={MainTabsNavigator} />

        {/* Flow Routes */}
        <Stack.Screen name="detail">
          {({ route }: any) => (
            <StoreDetail
              service={route.params?.service || "food"}
              storeId={route.params?.storeId}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="rideConfirm" component={RideConfirm} />
        <Stack.Screen name="cart">
          {({ route }: any) => (
            <Cart service={route.params?.service || "food"} />
          )}
        </Stack.Screen>
        <Stack.Screen name="address">
          {({ route }: any) => (
            <DeliveryDetails service={route.params?.service || "food"} />
          )}
        </Stack.Screen>
        <Stack.Screen name="payment">
          {({ route }: any) => (
            <Payment service={route.params?.service || "food"} />
          )}
        </Stack.Screen>
        <Stack.Screen name="status">
          {({ route }: any) => (
            <OrderStatus
              orderId={route.params?.orderId || ""}
              initialView={route.params?.view}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="complete">
          {({ route }: any) => (
            <OrderComplete orderId={route.params?.orderId || ""} />
          )}
        </Stack.Screen>

        {/* Interconnected Flow & Auxiliary Routes */}
        <Stack.Screen name="addAddress">
          {({ route }: any) => (
            <AddAddress mode={route.params?.mode || "delivery"} />
          )}
        </Stack.Screen>
        <Stack.Screen name="paymentMethods" component={PaymentMethods} />
        <Stack.Screen name="addMoney" component={AddMoney} />
        <Stack.Screen name="help">
          {({ route }: any) => (
            <Help orderId={route.params?.orderId} />
          )}
        </Stack.Screen>

        {/* Secondary Remaining Routes */}
        <Stack.Screen name="notifications">
          {() => <GenericScreenShell title="Notifications" />}
        </Stack.Screen>
        <Stack.Screen name="places">
          {({ route }: any) => (
            <Places mode={route.params?.mode || "manage"} />
          )}
        </Stack.Screen>
        <Stack.Screen name="addPaymentMethod">
          {() => <GenericScreenShell title="Add Payment Method" />}
        </Stack.Screen>
        <Stack.Screen name="chatSupport">
          {() => <GenericScreenShell title="Chat Support" />}
        </Stack.Screen>
        <Stack.Screen name="restaurantsList">
          {() => <GenericScreenShell title="Restaurants" />}
        </Stack.Screen>
        <Stack.Screen name="orderDetail">
          {() => <GenericScreenShell title="Order Receipt" />}
        </Stack.Screen>
        <Stack.Screen name="profile">
          {() => <GenericScreenShell title="Profile Settings" />}
        </Stack.Screen>
        <Stack.Screen name="favorites">
          {() => <GenericScreenShell title="Favorites" />}
        </Stack.Screen>
        <Stack.Screen name="transactions">
          {() => <GenericScreenShell title="Transactions" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  cardPad: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  btnPad: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 1.2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 6,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
  orderSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  profileSub: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  placeholderText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
});

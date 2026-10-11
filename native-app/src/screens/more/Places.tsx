import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import type { PlacesMode } from "../../navigation/types";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";
import { colors, radii } from "../../theme/tokens";

interface PlacesProps {
  mode: PlacesMode;
}

export default function Places({ mode }: PlacesProps) {
  const { back, push } = useNav();
  const {
    state,
    setDefaultPlace,
    setRide,
    setCourier,
    addPlace,
    removePlace,
    showToast,
  } = useApp();
  const [detecting, setDetecting] = useState(false);

  const handleUseCurrentLocation = async () => {
    setDetecting(true);
    showToast("Requesting GPS location permission...");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setDetecting(false);
        showToast(
          "Location permission denied. Please select from saved addresses."
        );
        return;
      }

      showToast("Detecting GPS coordinates...");
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;
      const newPlace = addPlace({
        label: "Current Location",
        line: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
        area: "GPS Coordinates",
        icon: "pin",
        coords: { lat: latitude, lng: longitude },
      });

      setDetecting(false);
      handleSelectPlace(newPlace.id);
      showToast("📍 Live GPS location saved and selected");
    } catch (err) {
      setDetecting(false);
      console.warn("Location error:", err);
      showToast(
        "Could not detect live GPS location. Please choose a saved place."
      );
    }
  };

  const handleSelectPlace = (placeId: string) => {
    switch (mode) {
      case "delivery":
        setDefaultPlace(placeId);
        showToast("Delivery address updated");
        back();
        break;
      case "ridePickup":
        setRide({ pickupId: placeId });
        showToast("Pickup location set");
        back();
        break;
      case "rideDrop":
        setRide({ dropId: placeId });
        showToast("Destination set");
        back();
        break;
      case "courierPickup":
        setCourier({ pickupId: placeId });
        showToast("Courier pickup set");
        back();
        break;
      case "courierDrop":
        setCourier({ dropId: placeId });
        showToast("Courier drop-off set");
        back();
        break;
      case "manage":
        setDefaultPlace(placeId);
        showToast("Default address updated");
        break;
    }
  };

  const getActiveId = () => {
    switch (mode) {
      case "delivery":
      case "manage":
        return state.defaultPlaceId;
      case "ridePickup":
        return state.ride.pickupId;
      case "rideDrop":
        return state.ride.dropId;
      case "courierPickup":
        return state.courier.pickupId;
      case "courierDrop":
        return state.courier.dropId;
    }
  };

  const activeId = getActiveId();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlowHeader title="" onBack={back} showHelp={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIconBox}>
            <Icon name="pin" size={28} color={colors.accent} />
          </View>
          <Text style={styles.heroEyebrow}>SAVED PLACES</Text>
          <Text style={styles.heroTitle}>
            {mode === "manage"
              ? "Saved addresses"
              : mode.includes("Pickup")
              ? "Choose pickup location"
              : "Choose destination"}
          </Text>
          <Text style={styles.heroSub}>
            Use a saved place or add a new address for faster checkout.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {/* GPS Current Location Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUseCurrentLocation}
            disabled={detecting}
            style={styles.gpsRow}
          >
            <View style={styles.gpsIconBox}>
              {detecting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Icon name="pin" size={16} color="#ffffff" />
              )}
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.gpsTitle}>
                {detecting
                  ? "Detecting GPS location..."
                  : "Use current location (GPS)"}
              </Text>
              <Text style={styles.itemSub}>
                Enable device location for precise real-time mapping
              </Text>
            </View>
            <Icon name="arrow" size={16} color={colors.accent} />
          </TouchableOpacity>

          {/* Saved Places List */}
          {state.places.map((place) => {
            const isSelected = place.id === activeId;
            return (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.8}
                onPress={() => handleSelectPlace(place.id)}
                style={[
                  styles.placeRow,
                  isSelected && styles.placeRowSelected,
                ]}
              >
                <View
                  style={[
                    styles.placeIconBox,
                    isSelected && styles.placeIconBoxSelected,
                  ]}
                >
                  <Icon
                    name={place.icon}
                    size={16}
                    color={isSelected ? colors.accent : colors.muted}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.placeTitle}>{place.label}</Text>
                  <Text style={styles.itemSub}>{place.line}</Text>
                </View>
                {mode === "manage" && state.places.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      removePlace(place.id);
                      showToast(`Removed ${place.label}`);
                    }}
                    style={styles.deleteBtn}
                  >
                    <Icon name="trash" size={16} color={colors.muted} />
                  </TouchableOpacity>
                ) : (
                  <Icon
                    name={isSelected ? "check" : "arrow"}
                    size={16}
                    color={isSelected ? colors.accent : colors.muted}
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Add a New Address Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => push({ name: "addAddress", mode })}
            style={[styles.placeRow, { backgroundColor: "#fbf9f6" }]}
          >
            <View style={styles.placeIconBox}>
              <Icon name="plus" size={16} color={colors.ink} />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.placeTitle}>Add a new address</Text>
            </View>
            <Icon name="arrow" size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionPad}>
          <Button onPress={back}>Done</Button>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 280,
  },
  listContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.accentSoft,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(224, 90, 15, 0.2)",
  },
  gpsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  placeRowSelected: {
    backgroundColor: colors.accentSoft,
  },
  placeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  placeIconBoxSelected: {
    backgroundColor: "#ffffff",
  },
  itemDetails: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  itemSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  actionPad: {
    marginTop: 28,
  },
});

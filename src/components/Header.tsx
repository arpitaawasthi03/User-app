import Icon from "./Icon";
import { useApp } from "../state/AppState";
import { useNav } from "../navigation/Navigation";
import { initials } from "../lib/format";

export default function Header({ dark = false }: { dark?: boolean }) {
  const { state, placeById } = useApp();
  const { push, switchTab } = useNav();

  const currentPlace = placeById(state.defaultPlaceId) ?? state.places[0];
  const placeLabel = currentPlace ? `${currentPlace.label}, ${currentPlace.area.split(",")[0]}` : "Select Location";
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const userInitials = initials(state.profile.name || "Arjun Khanna");

  return (
    <header className={`app-header ${dark ? "dark" : ""}`}>
      <button
        type="button"
        className="location"
        onClick={() => push({ name: "places", mode: "delivery" })}
        aria-label="Change delivery location"
      >
        <span className="location-icon">
          <Icon name="pin" size={16} />
        </span>
        <div>
          <small>Delivering to</small>
          <strong>{placeLabel}</strong>
        </div>
        <span className="chevron">⌄</span>
      </button>

      <button
        type="button"
        className="icon-button"
        aria-label="Notifications"
        onClick={() => push({ name: "notifications" })}
      >
        <Icon name="bell" size={20} />
        {unreadCount > 0 && <i />}
      </button>

      <button
        type="button"
        className="avatar"
        onClick={() => switchTab("account")}
        aria-label="Account profile"
      >
        {userInitials}
      </button>
    </header>
  );
}

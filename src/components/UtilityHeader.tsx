import Icon from "./Icon";
import { useNav } from "../navigation/Navigation";
import { useApp } from "../state/AppState";

interface UtilityHeaderProps {
  title: string;
  subtitle: string;
}

export default function UtilityHeader({ title, subtitle }: UtilityHeaderProps) {
  const { push } = useNav();
  const { state } = useApp();
  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <header className="utility-header">
      <div>
        <p>{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <button
        type="button"
        className="icon-button"
        aria-label="Notifications"
        onClick={() => push({ name: "notifications" })}
      >
        <Icon name="bell" size={20} />
        {unreadCount > 0 && <i />}
      </button>
    </header>
  );
}

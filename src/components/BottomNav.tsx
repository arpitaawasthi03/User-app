import Icon from "./Icon";
import type { TabName } from "../navigation/Navigation";

interface BottomNavProps {
  active: TabName;
  count: number;
  onSelect: (value: TabName) => void;
}

export default function BottomNav({ active, count, onSelect }: BottomNavProps) {
  const items: [TabName, string, string][] = [
    ["navcart", "cart", "Cart"],
    ["wallet", "wallet", "Wallet"],
    ["orders", "list", "Orders"],
    ["account", "user", "Account"],
  ];

  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          type="button"
          className={id === active ? "active" : ""}
          onClick={() => onSelect(id)}
          aria-label={label}
        >
          <span>
            <Icon name={icon} size={21} />
            {id === "navcart" && count > 0 && <i>{count}</i>}
          </span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

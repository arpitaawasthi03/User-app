import Icon from "./Icon";
import type { Service } from "../data/demo";

interface ServiceTabsProps {
  service: Service;
  onSelect: (value: Service) => void;
}

export default function ServiceTabs({ service, onSelect }: ServiceTabsProps) {
  const items: [Service, string, string][] = [
    ["food", "food", "Food"],
    ["rides", "car", "Rides"],
    ["grocery", "bag", "Grocery"],
    ["courier", "box", "Courier"],
  ];

  return (
    <nav className="service-tabs" aria-label="Services">
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          type="button"
          className={id === service ? "active" : ""}
          onClick={() => onSelect(id)}
          aria-selected={id === service}
          role="tab"
        >
          <Icon name={icon} size={16} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

import Icon from "./Icon";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  onFilter?: () => void;
}

export default function SearchBar({ placeholder, value, onChange, onFilter }: SearchBarProps) {
  return (
    <div className="search-bar">
      <Icon name="search" size={20} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          aria-label="Clear search"
          style={{ paddingRight: 6 }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
      <button
        type="button"
        aria-label="Search filters"
        onClick={onFilter}
      >
        <Icon name="filter" size={18} />
      </button>
    </div>
  );
}

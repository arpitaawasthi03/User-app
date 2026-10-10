import Icon from "./Icon";
import { useNav } from "../navigation/Navigation";

interface FlowHeaderProps {
  title?: string;
  onBack?: () => void;
  showHelp?: boolean;
}

export default function FlowHeader({ title = "", onBack, showHelp = true }: FlowHeaderProps) {
  const { back, push } = useNav();

  const handleBack = () => {
    if (onBack) onBack();
    else back();
  };

  return (
    <header className="flow-header">
      <button type="button" onClick={handleBack} aria-label="Go back">
        <Icon name="back" />
      </button>
      <h2>{title}</h2>
      {showHelp ? (
        <button
          type="button"
          aria-label="Help"
          onClick={() => push({ name: "help" })}
        >
          ?
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </header>
  );
}

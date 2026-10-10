import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { formatWhen } from "../../lib/format";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Notifications() {
  const { back } = useNav();
  const { state, markAllRead, showToast } = useApp();

  const handleMarkAll = () => {
    markAllRead();
    showToast("All notifications marked as read");
  };

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="bell" size={28} />
        </span>
        <p>YOU'RE ALL CAUGHT UP</p>
        <h1>Notifications</h1>
        <p>Updates from every RoadRider service appear together here.</p>
      </div>

      <div className="more-list">
        {state.notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            className={!n.read ? "selected" : ""}
            onClick={() => showToast(n.text)}
          >
            <span>
              <Icon name="check" size={15} />
            </span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", fontSize: 11, marginBottom: 2 }}>
                {n.text}
              </strong>
              <small style={{ fontSize: 9, color: "var(--muted)" }}>
                {formatWhen(n.when)}
              </small>
            </div>
            {!n.read && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  minWidth: 8,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div style={{ margin: "14px 4px", display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={handleMarkAll}
          style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}
        >
          Mark all as read
        </button>
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

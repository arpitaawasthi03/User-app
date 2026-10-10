import { useState } from "react";
import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function AddMoney() {
  const { back } = useNav();
  const { state, addMoney, showToast } = useApp();
  const [amount, setAmount] = useState<number>(500);
  const [customInput, setCustomInput] = useState<string>("500");

  const quickAmounts = [200, 500, 1000];

  const handleSelectQuick = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleCustomChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    setCustomInput(val);
    setAmount(isNaN(num) ? 0 : num);
  };

  const handleAdd = () => {
    if (amount < 10) {
      showToast("Minimum top-up amount is ₹10");
      return;
    }
    if (amount > 10000) {
      showToast("Maximum top-up amount is ₹10,000 in demo mode");
      return;
    }
    addMoney(amount);
    showToast(`Added ${rupees(amount)} demo funds to your RoadRider Wallet!`);
    back();
  };

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="wallet" size={28} />
        </span>
        <p>ROADRIDER WALLET</p>
        <h1>Add money</h1>
        <p>
          Top up once and pay instantly across every service. Current balance:{" "}
          <b>{rupees(state.wallet.balance)}</b>
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 17,
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 8 }}>
            SELECT TOP-UP AMOUNT
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSelectQuick(q)}
                style={{
                  padding: "12px 0",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  border: amount === q ? "2px solid var(--accent)" : "1px solid var(--line)",
                  background: amount === q ? "var(--accent-soft)" : "#fff",
                  color: amount === q ? "var(--accent)" : "inherit",
                }}
              >
                {rupees(q)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 6 }}>
            OR ENTER CUSTOM AMOUNT (₹)
          </label>
          <input
            value={customInput}
            onChange={(e) => handleCustomChange(e.target.value)}
            inputMode="numeric"
            placeholder="e.g. 750"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              fontSize: 14,
              fontWeight: 700,
              outline: "none",
            }}
          />
        </div>

        <p style={{ margin: 0, fontSize: 10, color: "var(--muted)", lineHeight: 1.4 }}>
          Demo mode: Funds are credited directly to your local wallet without charging your card.
        </p>
      </div>

      <div className="more-action">
        <Button onClick={handleAdd}>Add {rupees(amount || 0)}</Button>
      </div>
    </div>
  );
}

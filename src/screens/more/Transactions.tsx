import FlowHeader from "../../components/FlowHeader";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { formatWhen } from "../../lib/format";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Transactions() {
  const { back } = useNav();
  const { state } = useApp();

  return (
    <div className="more-page">
      <FlowHeader title="" onBack={back} showHelp={false} />

      <div className="more-hero">
        <span>
          <Icon name="list" size={28} />
        </span>
        <p>WALLET STATEMENTS</p>
        <h1>All transactions</h1>
        <p>Complete record of charges, refunds, and wallet top-ups.</p>
      </div>

      <div className="transaction-list">
        {state.wallet.txns.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 11 }}>
            No transactions found.
          </div>
        ) : (
          state.wallet.txns.map((txn) => {
            const isCredit = txn.amount > 0;
            return (
              <article key={txn.id}>
                <span>
                  <Icon name={txn.icon} size={18} />
                </span>
                <div>
                  <strong>{txn.label}</strong>
                  <small>{formatWhen(txn.when)}</small>
                </div>
                <b className={isCredit ? "credit" : ""}>
                  {isCredit ? `+ ${rupees(txn.amount)}` : `− ${rupees(Math.abs(txn.amount))}`}
                </b>
              </article>
            );
          })
        )}
      </div>

      <div className="more-action">
        <Button onClick={back}>Done</Button>
      </div>
    </div>
  );
}

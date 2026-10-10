import UtilityHeader from "../../components/UtilityHeader";
import Icon from "../../components/Icon";
import { formatWhen } from "../../lib/format";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

export default function Wallet() {
  const { push } = useNav();
  const { state, setAutoTopUp, showToast } = useApp();

  const handleToggleAutoTopUp = () => {
    const next = !state.wallet.autoTopUp;
    setAutoTopUp(next);
    showToast(next ? "Auto top-up enabled when balance falls below ₹100" : "Auto top-up disabled");
  };

  const recentTxns = state.wallet.txns.slice(0, 4);

  return (
    <div className="utility-page">
      <UtilityHeader title="Wallet" subtitle="PAYMENTS & BALANCE" />

      <section className="wallet-hero">
        <p>AVAILABLE BALANCE</p>
        <h2>{rupees(state.wallet.balance)}.00</h2>
        <span>RoadRider Wallet</span>
        <button
          type="button"
          onClick={() => push({ name: "addMoney" })}
        >
          + Add money
        </button>
      </section>

      <div className="quick-actions">
        <button
          type="button"
          onClick={() => push({ name: "paymentMethods" })}
        >
          <span>
            <Icon name="card" />
          </span>
          <small>Payment methods</small>
        </button>

        <button
          type="button"
          onClick={handleToggleAutoTopUp}
        >
          <span style={state.wallet.autoTopUp ? { color: "#318454" } : undefined}>
            <Icon name="shield" />
          </span>
          <small>{state.wallet.autoTopUp ? "Auto top-up: ON" : "Auto top-up"}</small>
        </button>

        <button
          type="button"
          onClick={() => push({ name: "transactions" })}
        >
          <span>
            <Icon name="list" />
          </span>
          <small>Statements</small>
        </button>
      </div>

      <div className="section-heading">
        <h2>Recent transactions</h2>
        <button
          type="button"
          onClick={() => push({ name: "transactions" })}
        >
          See all
        </button>
      </div>

      <div className="transaction-list">
        {recentTxns.map((txn) => {
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
        })}
      </div>

      <section className="linked-card">
        <span>
          <Icon name="card" />
        </span>
        <div>
          <small>LINKED PAYMENT METHOD</small>
          <strong>Visa ending in 4821</strong>
        </div>
        <button
          type="button"
          onClick={() => push({ name: "paymentMethods" })}
        >
          Manage
        </button>
      </section>
    </div>
  );
}

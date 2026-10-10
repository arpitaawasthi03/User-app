import type { Service } from "../data/demo";
import { computeBill, rupees, type Bill } from "../lib/pricing";
import { useApp } from "../state/AppState";

interface BillSummaryProps {
  service: Service;
  billOverride?: Bill;
}

export default function BillSummary({ service, billOverride }: BillSummaryProps) {
  const { itemTotal, state } = useApp();
  const bill = billOverride ?? computeBill(service, itemTotal(service), state.promos[service] ?? null);

  return (
    <div className="bill">
      <h3>Bill details</h3>
      <div>
        <span>Item total</span>
        <b>{rupees(bill.itemTotal)}</b>
      </div>
      {bill.discount > 0 && (
        <div>
          <span>Discount ({bill.promo})</span>
          <b className="success">− {rupees(bill.discount)}</b>
        </div>
      )}
      {bill.deliveryFee !== undefined && service !== "rides" && service !== "courier" && (
        <div>
          <span>Delivery fee</span>
          <b className="success">FREE</b>
        </div>
      )}
      {bill.taxes !== null && (
        <div>
          <span>Taxes & fees</span>
          <b>{rupees(bill.taxes)}</b>
        </div>
      )}
      <div className="bill-total">
        <span>To pay</span>
        <strong>{rupees(bill.toPay)}</strong>
      </div>
    </div>
  );
}

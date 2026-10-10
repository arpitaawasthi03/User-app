import { useState } from "react";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { rupees } from "../../lib/pricing";
import { useNav } from "../../navigation/Navigation";
import { useApp } from "../../state/AppState";

interface OrderCompleteProps {
  orderId: string;
}

export default function OrderComplete({ orderId }: OrderCompleteProps) {
  const { reset } = useNav();
  const { state, rateOrder, showToast } = useApp();

  const order = state.orders.find((o) => o.id === orderId) ?? state.orders[0];
  const [selectedRating, setSelectedRating] = useState<number>(order?.rating ?? 5);

  const isRide = order?.service === "rides";
  const totalPaid = order ? rupees(order.bill.toPay) : "₹289";

  const handleRate = (stars: number) => {
    setSelectedRating(stars);
    if (order) {
      rateOrder(order.id, stars);
    }
    showToast(`Thanks for rating ${stars} stars!`);
  };

  const handleBackToHome = () => {
    reset([{ name: "home" }]);
  };

  return (
    <div className="status-page complete-page">
      <div className="success-mark">
        <Icon name="check" size={42} />
      </div>

      <p className="eyebrow">ALL DONE</p>
      <h1>{isRide ? "Hope you enjoyed\nthe ride!" : "Delivered with care."}</h1>
      <p>
        {isRide
          ? "You arrived at Gomti Nagar at 4:42 PM."
          : "Thanks for choosing RoadRider. Your order has been completed."}
      </p>

      <div className="receipt">
        <div>
          <span>Total paid</span>
          <strong>{totalPaid}</strong>
        </div>
        <div>
          <span>Payment</span>
          <b>{order?.payment ?? "RoadRider Wallet"}</b>
        </div>
      </div>

      <h3>How was your experience?</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            aria-label={`Rate ${star} star`}
          >
            <Icon
              name="star"
              size={28}
              filled={star <= selectedRating}
            />
          </button>
        ))}
      </div>

      <Button onClick={handleBackToHome}>
        Back to home
      </Button>
    </div>
  );
}

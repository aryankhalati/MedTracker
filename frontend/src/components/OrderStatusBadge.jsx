export default function OrderStatusBadge({ status }) {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span className={`order-status-badge status-${status}`}>
      {labels[status] || status}
    </span>
  );
}
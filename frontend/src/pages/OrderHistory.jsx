import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-item">
            <div>
              <strong>{order.medicineName}</strong>
              <span> — {order.quantity} units</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        ))
      )}
    </div>
  );
}
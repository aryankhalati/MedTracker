import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import OrderStatusBadge from "../../components/OrderStatusBadge";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const statuses = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"];

  useEffect(() => {
    api.get(`/admin/orders/${id}`).then((res) => {
      setOrder(res.data);
    });
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setError("");
    try {
      const res = await api.patch(`/admin/orders/${id}`, { status: newStatus });
      setOrder((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="admin-order-detail">
      <h2>{order.medicineName}</h2>
      <p>Patient: {order.userId?.name} ({order.userId?.email})</p>
      <p>Quantity: {order.quantity}</p>
      <p>Current status: <OrderStatusBadge status={order.status} /></p>

      {error && <p className="form-error">{error}</p>}

      <div className="status-buttons">
        {statuses.map((s) => (
          <button
            key={s}
            className={order.status === s ? "active-status" : ""}
            onClick={() => handleStatusChange(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <Link to="/admin" className="back-link">← Back to admin dashboard</Link>
    </div>
  );
}
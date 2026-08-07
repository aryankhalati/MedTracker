import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import OrderStatusBadge from "../../components/OrderStatusBadge";

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/patients"), api.get("/admin/orders")]).then(
      ([patientsRes, ordersRes]) => {
        setPatients(patientsRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Patients ({patients.length})</h3>
        {patients.map((p) => (
          <div key={p._id} className="admin-patient-item">
            <strong>{p.name}</strong>
            <span>{p.email}</span>
          </div>
        ))}
      </section>

      <section>
        <h3>All Orders ({orders.length})</h3>
        {orders.map((order) => (
          <Link key={order._id} to={`/admin/orders/${order._id}`} className="admin-order-item">
            <div>
              <strong>{order.medicineName}</strong>
              <span> — {order.userId?.name} ({order.userId?.email})</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </Link>
        ))}
      </section>
    </div>
  );
}
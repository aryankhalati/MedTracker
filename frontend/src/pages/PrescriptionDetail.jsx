import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/prescriptions/${id}`).then((res) => {
      setPrescription(res.data);
      setQuantity(res.data.quantity);
    });
  }, [id]);

  const handleUpdate = async () => {
    setError("");
    try {
      const res = await api.put(`/prescriptions/${id}`, { quantity: Number(quantity) });
      setPrescription(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update prescription");
    }
  };

  const handleDelete = async () => {
    await api.delete(`/prescriptions/${id}`);
    navigate("/");
  };

  const handleReorder = async () => {
    await api.post("/orders", { prescriptionId: id, quantity: prescription.quantity });
    navigate("/orders");
  };

  if (!prescription) return <p>Loading...</p>;

  return (
    <div className="prescription-detail">
      <h2>{prescription.medicineName}</h2>
      <p>{prescription.dosage} — {prescription.dosesPerDay}x daily</p>
      <p>{prescription.daysRemaining} days remaining</p>

      {editing ? (
        <>
          {error && <p className="form-error">{error}</p>}
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
          <div className="prescription-detail-actions">
            <button onClick={handleUpdate}>Save</button>
            <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <div className="prescription-detail-actions">
          <button onClick={() => setEditing(true)}>Edit Quantity</button>
          <button onClick={handleReorder}>Reorder</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      )}

      <Link to="/" className="back-link">← Back to dashboard</Link>
    </div>
  );
}
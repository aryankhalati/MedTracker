import { Link } from "react-router-dom";

export default function PrescriptionCard({ prescription }) {
  const isLowStock = prescription.daysRemaining <= 3;

  return (
    <div className="prescription-card">
      <h3>{prescription.medicineName}</h3>
      <p className="dosage-text">{prescription.dosage} — {prescription.dosesPerDay}x daily</p>
      {prescription.condition && <span className="condition-tag">{prescription.condition}</span>}
      <div className={`days-remaining ${isLowStock ? "low-stock" : ""}`}>
        {prescription.daysRemaining} {prescription.daysRemaining === 1 ? "day" : "days"} remaining
      </div>
      <Link to={`/prescriptions/${prescription._id}`}>View details →</Link>
    </div>
  );
}
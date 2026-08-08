import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoseChecklist() {
  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoses = async () => {
    const res = await api.get("/doses/today");
    setDoses(res.data);
  };

  useEffect(() => {
    fetchDoses().finally(() => setLoading(false));
  }, []);

  const markStatus = async (id, status) => {
    await api.patch(`/doses/${id}`, { status });
    fetchDoses();
  };

  if (loading) return <p>Loading today's doses...</p>;

  return (
    <div className="dose-checklist">
      <h3>Today's Doses</h3>
      {doses.length === 0 ? (
        <p className="empty-state">No doses scheduled for today.</p>
      ) : (
        doses.map((dose) => (
          <div key={dose._id} className={`dose-item dose-${dose.status}`}>
            <div className="dose-info">
              <strong>{dose.prescriptionId?.medicineName}</strong>
             <span>
  {dose.prescriptionId?.dosage} —{" "}
  {new Date(dose.scheduledTime).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</span>
            </div>
            <div className="dose-actions">
              {dose.status === "pending" ? (
                <>
                  <button onClick={() => markStatus(dose._id, "taken")}>Taken</button>
                  <button onClick={() => markStatus(dose._id, "missed")}>Missed</button>
                </>
              ) : (
                <span className="dose-status-label">{dose.status}</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
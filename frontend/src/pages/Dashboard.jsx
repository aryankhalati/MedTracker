import { useEffect, useState } from "react";
import api from "../api/axios";
import PrescriptionCard from "../components/PrescriptionCard";
import PrescriptionForm from "../components/PrescriptionForm";
import DoseChecklist from "../components/DoseChecklist";
import AdherenceStats from "../components/AdherenceStats";

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPrescriptions = async () => {
    const res = await api.get("/prescriptions");
    setPrescriptions(res.data);
  };

  useEffect(() => {
    fetchPrescriptions().finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <AdherenceStats refreshTrigger={refreshTrigger} />
      <DoseChecklist onDoseUpdate={() => setRefreshTrigger((prev) => prev + 1)} />

      <PrescriptionForm onCreated={fetchPrescriptions} />

      <div className="prescriptions-grid">
        {prescriptions.length === 0 ? (
          <p className="empty-state">No prescriptions yet. Add one above.</p>
        ) : (
          prescriptions.map((p) => (
            <PrescriptionCard key={p._id} prescription={p} />
          ))
        )}
      </div>
    </div>
  );
}
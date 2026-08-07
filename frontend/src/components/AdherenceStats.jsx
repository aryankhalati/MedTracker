import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdherenceStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/doses/adherence").then((res) => setStats(res.data));
  }, []);

  if (!stats) return null;

  return (
    <div className="adherence-stats">
      <div className="adherence-percentage">{stats.adherencePercentage}%</div>
      <p className="adherence-label">Adherence rate</p>
      <div className="adherence-breakdown">
        <span>{stats.takenDoses} taken</span>
        <span>{stats.missedDoses} missed</span>
      </div>
    </div>
  );
}
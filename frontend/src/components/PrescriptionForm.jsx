import { useState } from "react";
import api from "../api/axios";

export default function PrescriptionForm({ onCreated }) {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dosesPerDay, setDosesPerDay] = useState(1);
  const [doseTimes, setDoseTimes] = useState([""]);
  const [condition, setCondition] = useState("");
  const [prescribingDoctor, setPrescribingDoctor] = useState("");
  const [error, setError] = useState("");

  const handleDoseTimeChange = (index, value) => {
    const updated = [...doseTimes];
    updated[index] = value;
    setDoseTimes(updated);
  };

  const addDoseTimeField = () => {
    setDoseTimes([...doseTimes, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/prescriptions", {
        medicineName,
        dosage,
        quantity: Number(quantity),
        dosesPerDay: Number(dosesPerDay),
        doseTimes: doseTimes.filter((t) => t !== ""),
        condition: condition || undefined,
        prescribingDoctor: prescribingDoctor || undefined,
      });
      setMedicineName("");
      setDosage("");
      setQuantity("");
      setDosesPerDay(1);
      setDoseTimes([""]);
      setCondition("");
      setPrescribingDoctor("");
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create prescription");
    }
  };

  return (
    <form className="prescription-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <input placeholder="Medicine name" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required />
      <input placeholder="Dosage (e.g. 5mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
      <input type="number" placeholder="Doses per day" value={dosesPerDay} onChange={(e) => setDosesPerDay(e.target.value)} required min="1" />

      {doseTimes.map((time, index) => (
        <input
          key={index}
          type="time"
          value={time}
          onChange={(e) => handleDoseTimeChange(index, e.target.value)}
          required
        />
      ))}
      <button type="button" onClick={addDoseTimeField}>+ Add another time</button>

      <input placeholder="Condition (optional)" value={condition} onChange={(e) => setCondition(e.target.value)} />
      <input placeholder="Prescribing doctor (optional)" value={prescribingDoctor} onChange={(e) => setPrescribingDoctor(e.target.value)} />
      <button type="submit">Add Prescription</button>
    </form>
  );
}
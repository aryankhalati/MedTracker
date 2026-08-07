import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await verifyOtp(email, otp);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      await resendOtp(email);
      setMessage("A new code has been sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify your email</h2>
      {error && <p className="form-error">{error}</p>}
      {message && <p style={{ color: "var(--accent-strong)", textAlign: "center", fontSize: "0.9rem" }}>{message}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
      <p>
        Didn't get a code?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
          Resend
        </a>
      </p>
      <p><Link to="/login">Back to login</Link></p>
    </form>
  );
}
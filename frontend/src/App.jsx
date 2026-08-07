import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import PrescriptionDetail from "./pages/PrescriptionDetail";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        </Route>
      </Routes>
    </>
  );
}
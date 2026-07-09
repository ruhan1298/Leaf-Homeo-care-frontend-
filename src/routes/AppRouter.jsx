import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/patient/register";
import Login from "../pages/patient/login";
import DoctorLogin from "../pages/doctor/login";
import AdminLogin from "../pages/admin/login"
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDoctors from "../pages/admin/doctor";
import PatientDashboard from "../pages/patient/Dashboard";
import AdminPatients from "../pages/admin/Patient";
import AdminAppointments from "../pages/admin/Appointment";
import AdminProfile from "../pages/admin/Profile";
import AdminForgotPassword from "../pages/admin/ForgotPassword";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/doctors" element={<AdminDoctors />} />
      <Route path="/admin/patients" element={<AdminPatients />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
    </Routes>
  );
}

export default AppRouter;
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/patient/register";
import Login from "../pages/patient/login";
import DoctorLogin from "../pages/doctor/login";
import AdminLogin from "../pages/admin/login"
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDoctors from "../pages/admin/doctor";
import PatientDashboard from "../pages/patient/Dashboard";
import PatientBookAppointment from "../pages/patient/BookAppointment";
import AdminPatients from "../pages/admin/Patient";
import AdminAppointments from "../pages/admin/Appointment";
import AdminProfile from "../pages/admin/Profile";
import AdminForgotPassword from "../pages/admin/ForgotPassword";
import DoctorSelection from "../pages/patient/DoctorSelection";
import AppointmentDetails from "../pages/patient/AppointmentDetails";
import BookAnyDoctor from "../pages/patient/BookAnyDoctor";
import MyAppointments from "../pages/patient/MyAppointments";
import Profile from "../pages/patient/Profile";
import EditProfile from "../pages/patient/EditProfile";
import ChangePassword from "../pages/patient/ChangePassword";
import CompleteProfile from "../pages/patient/CompleteProfile";
import Notifications from "../pages/patient/Notifications";
import ProtectedRoute from "../components/ProtectedRoute";
import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorProfile from "../pages/doctor/Profile";
import DoctorAppointmentRequests from "../pages/doctor/AppointmentRequests";
import DoctorPatientDetails from "../pages/doctor/PatientDetails";
import DoctorConsultationHistory from "../pages/doctor/ConsultationHistory";
import DoctorAvailability from "../pages/doctor/Availability";
import DoctorNotifications from "../pages/doctor/Notifications";
import DoctorEditProfile from "../pages/doctor/EditProfile";
import DoctorChangePassword from "../pages/doctor/ChangePassword";
import PatientVideoCall from "../pages/patient/VideoCall";
import DoctorVideoCall from "../pages/doctor/VideoCall";
import PublicDoctorProfile from "../pages/PublicDoctorProfile";
import Chat from "../pages/Chat";


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Public route - no authentication required */}
      <Route path="/doctors/:id" element={<PublicDoctorProfile />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="admin"><AdminDoctors /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><AdminPatients /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute allowedRole="admin"><AdminAppointments /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><AdminProfile /></ProtectedRoute>} />
      <Route path="/patient/dashboard" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/book" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><PatientBookAppointment /></ProtectedRoute>} />
      <Route path="/patient/doctors" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><DoctorSelection /></ProtectedRoute>} />
      <Route path="/patient/book/doctor" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><AppointmentDetails /></ProtectedRoute>} />
      <Route path="/patient/book/any-doctor" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><BookAnyDoctor /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><MyAppointments /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><Profile /></ProtectedRoute>} />
      <Route path="/patient/profile/edit" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><EditProfile /></ProtectedRoute>} />
      <Route path="/patient/profile/change-password" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><ChangePassword /></ProtectedRoute>} />
      <Route path="/patient/complete-profile" element={<ProtectedRoute allowedRole="patient"><CompleteProfile /></ProtectedRoute>} />
      <Route path="/patient/notifications" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><Notifications /></ProtectedRoute>} />
      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute allowedRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/appointment-requests" element={<ProtectedRoute allowedRole="doctor"><DoctorAppointmentRequests /></ProtectedRoute>} />
      <Route path="/doctor/patient/:patientId" element={<ProtectedRoute allowedRole="doctor"><DoctorPatientDetails /></ProtectedRoute>} />
      <Route path="/doctor/consultation-history" element={<ProtectedRoute allowedRole="doctor"><DoctorConsultationHistory /></ProtectedRoute>} />
      <Route path="/doctor/availability" element={<ProtectedRoute allowedRole="doctor"><DoctorAvailability /></ProtectedRoute>} />
      <Route path="/doctor/notifications" element={<ProtectedRoute allowedRole="doctor"><DoctorNotifications /></ProtectedRoute>} />
      <Route path="/doctor/profile" element={<ProtectedRoute allowedRole="doctor"><DoctorProfile /></ProtectedRoute>} />
      <Route path="/doctor/profile/edit" element={<ProtectedRoute allowedRole="doctor"><DoctorEditProfile /></ProtectedRoute>} />
      <Route path="/doctor/profile/change-password" element={<ProtectedRoute allowedRole="doctor"><DoctorChangePassword /></ProtectedRoute>} />
      <Route path="/patient/video-call" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><PatientVideoCall /></ProtectedRoute>} />
      <Route path="/doctor/video-call" element={<ProtectedRoute allowedRole="doctor"><DoctorVideoCall /></ProtectedRoute>} />
      <Route path="/patient/chat" element={<ProtectedRoute allowedRole="patient" requireCompleteProfile><Chat /></ProtectedRoute>} />
      <Route path="/doctor/chat" element={<ProtectedRoute allowedRole="doctor"><Chat /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRouter;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import { getMyAppointments, cancelAppointment } from "../../api/appointmentApi";
import Payment from "../../components/Payment";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  Video,
  X,
  Search, 
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical
} from "lucide-react";

export default function MyAppointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingSuccess = location.state?.bookingSuccess;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (bookingSuccess) {
      // Clear the state after showing success
      window.history.replaceState({}, document.title);
    }
    fetchAppointments();
  }, [filter, bookingSuccess]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyAppointments();

      if (response.status === 1) {
        setAppointments(response.data || []);
      } else {
        setError(response.message || "Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Appointments fetch error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      const response = await cancelAppointment(appointmentId);

      if (response.status === 1) {
        Swal.fire({
          icon: "success",
          title: "Cancelled!",
          text: "Appointment cancelled successfully",
          confirmButtonColor: "#10b981"
        });
        await fetchAppointments();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to cancel appointment",
          confirmButtonColor: "#10b981"
        });
      }
    } catch (err) {
      console.error("Cancel appointment error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to cancel appointment",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || apt.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
      case "confirmed":
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
      case "confirmed":
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const canJoinCall = (appointmentDateTime) => {
    const now = new Date();
    const appointmentTime = new Date(appointmentDateTime);
    
    // Convert both times to UTC for accurate comparison
    const nowUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    
    const appointmentUTC = Date.UTC(
      appointmentTime.getUTCFullYear(),
      appointmentTime.getUTCMonth(),
      appointmentTime.getUTCDate(),
      appointmentTime.getUTCHours(),
      appointmentTime.getUTCMinutes(),
      appointmentTime.getUTCSeconds()
    );
    
    const timeDiff = appointmentUTC - nowUTC;
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow joining 10 minutes before appointment until 1 hour after
    return minutesDiff <= 10 && minutesDiff >= -60;
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-500">View and manage your appointments</p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{location.state?.message}</p>
            <button
              onClick={() => window.history.replaceState({}, document.title)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-gray-800 font-medium"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Pending", "Confirmed", "Paid", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === status.toLowerCase()
                    ? "bg-brand-primary text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <Calendar className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No appointments found</p>
            <button
              onClick={() => navigate("/patient/book")}
              className="px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-hover transition-all"
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-brand-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-light to-brand-primary/20 overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={appointment.doctorImage || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"}
                        alt={appointment.doctorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">Homeopathy Consultant</p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-1">Date</p>
                      <p className="text-sm font-bold text-gray-900">{formatDate(appointment.appointmentDateTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-1">Time</p>
                      <p className="text-sm font-bold text-gray-900">{formatTime(appointment.appointmentDateTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {appointment.status.toLowerCase() === "accepted" && (
                      <Payment
                        appointmentId={appointment.id}
                        amount={appointment.consultationFee || 500}
                        onSuccess={() => {
                          Swal.fire({
                            icon: "success",
                            title: "Payment Successful",
                            text: "Your appointment is now confirmed.",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                          fetchAppointments();
                        }}
                        onCancel={() => {
                          console.log("Payment cancelled");
                        }}
                      />
                    )}
                    {appointment.status.toLowerCase() === "pending" || appointment.status.toLowerCase() === "accepted" ? (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        {cancellingId === appointment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X size={16} />
                        )}
                        Cancel
                      </button>
                    ) : null}
                    {(appointment.status.toLowerCase() === "accepted" || appointment.status.toLowerCase() === "paid" || appointment.status.toLowerCase() === "confirmed") && (
                      <>
                        {canJoinCall(appointment.appointmentDateTime) ? (
                          <button 
                            onClick={() => navigate(`/patient/video-call?appointmentId=${appointment.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all"
                          >
                            <Video size={16} />
                            Join Call
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-medium">
                            <Clock size={16} />
                            <span className="text-sm">
                              {(() => {
                                const now = new Date();
                                const appointmentTime = new Date(appointment.appointmentDateTime);
                                
                                // Convert both times to UTC for accurate comparison
                                const nowUTC = Date.UTC(
                                  now.getUTCFullYear(),
                                  now.getUTCMonth(),
                                  now.getUTCDate(),
                                  now.getUTCHours(),
                                  now.getUTCMinutes(),
                                  now.getUTCSeconds()
                                );
                                
                                const appointmentUTC = Date.UTC(
                                  appointmentTime.getUTCFullYear(),
                                  appointmentTime.getUTCMonth(),
                                  appointmentTime.getUTCDate(),
                                  appointmentTime.getUTCHours(),
                                  appointmentTime.getUTCMinutes(),
                                  appointmentTime.getUTCSeconds()
                                );
                                
                                const minutesDiff = Math.ceil((appointmentUTC - nowUTC) / (1000 * 60));
                                if (minutesDiff > 0) {
                                  return `Available in ${minutesDiff} min`;
                                } else {
                                  return "Call ended";
                                }
                              })()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

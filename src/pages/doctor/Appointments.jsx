import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock, Video, Check, X, Filter, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import DoctorLayout from "../../components/DoctorLayout";
import { getDoctorAppointments, acceptAppointment, rejectAppointment } from "../../api/doctorApi";
import Swal from "sweetalert2";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

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
    case "rejected":
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
    case "rejected":
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

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getDoctorAppointments(filter);
        if (response.status === 1) {
          setAppointments(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // Use mock data if API fails
        setAppointments([
          { 
            id: 1, 
            patientId: 1,
            patientName: "Rahul Sharma", 
            patientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            patientPhone: "+91 98765 43210",
            appointmentDateTime: new Date().toISOString(),
            status: "pending",
            reason: "Fever and headache"
          },
          { 
            id: 2, 
            patientId: 2,
            patientName: "Priya Patel", 
            patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            patientPhone: "+91 87654 32109",
            appointmentDateTime: new Date().toISOString(),
            status: "accepted",
            reason: "Joint pain"
          },
          { 
            id: 3, 
            patientId: 3,
            patientName: "Amit Kumar", 
            patientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
            patientPhone: "+91 76543 21098",
            appointmentDateTime: new Date(Date.now() - 86400000).toISOString(),
            status: "completed",
            reason: "Digestive issues"
          },
          { 
            id: 4, 
            patientId: 4,
            patientName: "Sneha Gupta", 
            patientImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            patientPhone: "+91 65432 10987",
            appointmentDateTime: new Date(Date.now() - 86400000).toISOString(),
            status: "paid",
            reason: "Skin allergy"
          },
          { 
            id: 5, 
            patientId: 5,
            patientName: "Vikram Singh", 
            patientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            patientPhone: "+91 54321 09876",
            appointmentDateTime: new Date(Date.now() - 172800000).toISOString(),
            status: "cancelled",
            reason: "Respiratory problem"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter]);

  const handleAccept = async (id) => {
    try {
      setActionLoadingId(id);
      const response = await acceptAppointment(id);
      if (response.status === 1) {
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status: "accepted" } : apt
        ));
        Swal.fire({
          icon: "success",
          title: "Accepted",
          text: "Appointment accepted successfully",
          confirmButtonColor: "#00b100"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to accept appointment",
          confirmButtonColor: "#00b100"
        });
      }
    } catch (error) {
      console.error("Error accepting appointment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#00b100"
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      const response = await rejectAppointment(id);
      if (response.status === 1) {
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status: "rejected" } : apt
        ));
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "Appointment rejected successfully",
          confirmButtonColor: "#00b100"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to reject appointment",
          confirmButtonColor: "#00b100"
        });
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#00b100"
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoadingId(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: "completed" } : apt
    ));
    setActionLoadingId(null);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === "all" || apt.status === filter;
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-500">Manage your patient appointments</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-gray-800 font-medium"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Pending", "Accepted", "Paid", "Completed", "Cancelled"].map((status) => (
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

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <Calendar className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-brand-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-light to-brand-primary/20 overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={appointment.patientImage}
                        alt={appointment.patientName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">{appointment.reason || appointment.symptoms}</p>
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
                    {appointment.status.toLowerCase() === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(appointment.id)}
                          disabled={actionLoadingId === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-medium hover:bg-emerald-100 transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === appointment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(appointment.id)}
                          disabled={actionLoadingId === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === appointment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                          Reject
                        </button>
                      </>
                    )}
                    {(appointment.status.toLowerCase() === "accepted" || appointment.status.toLowerCase() === "paid" || appointment.status.toLowerCase() === "confirmed") && (
                      <>
                        <button
                          onClick={() => handleComplete(appointment.id)}
                          disabled={actionLoadingId === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === appointment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                          Complete
                        </button>
                        {canJoinCall(appointment.appointmentDateTime) ? (
                          <button 
                            onClick={() => navigate(`/doctor/video-call?appointmentId=${appointment.id}`)}
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
    </DoctorLayout>
  );
}

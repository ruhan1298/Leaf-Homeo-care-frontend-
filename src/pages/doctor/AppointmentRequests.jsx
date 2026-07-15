import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/DoctorLayout";
import { 
  Search, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Filter, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  User,
  Video,
  Eye
} from "lucide-react";
import { acceptAppointment, rejectAppointment, getDoctorAppointments } from "../../api/doctorApi";
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

export default function AppointmentRequests() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

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
          status: "pending",
          reason: "Joint pain"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    const result = await Swal.fire({
      title: "Accept Appointment?",
      text: "Do you want to accept this appointment request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00b100",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!"
    });

    if (result.isConfirmed) {
      try {
        setActionLoadingId(id);
        const response = await acceptAppointment(id);
        if (response.status === 1) {
          Swal.fire({
            icon: "success",
            title: "Accepted!",
            text: "Appointment has been accepted successfully.",
            confirmButtonColor: "#00b100"
          });
          fetchAppointments();
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
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Reject Appointment?",
      text: "Do you want to reject this appointment request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#00b100",
      confirmButtonText: "Yes, reject it!"
    });

    if (result.isConfirmed) {
      try {
        setActionLoadingId(id);
        const response = await rejectAppointment(id);
        if (response.status === 1) {
          Swal.fire({
            icon: "success",
            title: "Rejected!",
            text: "Appointment has been rejected.",
            confirmButtonColor: "#00b100"
          });
          fetchAppointments();
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
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patient/${patientId}`);
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Appointment Requests</h1>
          <p className="text-gray-500">Manage incoming appointment requests from patients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Pending Requests</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {appointments.filter(a => a.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Accepted Today</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {appointments.filter(a => a.status === "accepted").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Completed</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {appointments.filter(a => a.status === "completed").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Total Requests</p>
                <p className="text-2xl font-extrabold text-gray-900">{appointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center">
                <Calendar className="h-6 w-6 text-brand-primary" />
              </div>
            </div>
          </div>
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
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "accepted", "completed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === status
                    ? "bg-brand-primary text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-primary"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <Calendar className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No appointment requests found</p>
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
                        src={appointment.patientImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                        alt={appointment.patientName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">{appointment.reason || "No reason provided"}</p>
                      <p className="text-xs text-gray-400 mt-1">{appointment.patientPhone || appointment.phone || "No phone provided"}</p>
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
                    <button
                      onClick={() => handleViewPatient(appointment.patientId)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      <Eye size={16} />
                      View
                    </button>
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
                    {appointment.status.toLowerCase() === "accepted" && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all">
                        <Video size={16} />
                        Join Call
                      </button>
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

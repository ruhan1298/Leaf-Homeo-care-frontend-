import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/DoctorLayout";
import { Users, Calendar, Clock, CheckCircle, Stethoscope, Video, Star, ArrowRight, Edit, Trash2, X, Save } from "lucide-react";
import { getUser } from "../../api/authApi";
import { getDoctorAppointments } from "../../api/doctorApi";

function formatShortDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor profile
        const userResponse = await getUser();
        if (userResponse.status === 1) {
          setDoctorData(userResponse.data);
        }

        // Fetch appointments for stats
        const appointmentsResponse = await getDoctorAppointments("all");
        if (appointmentsResponse.status === 1) {
          const appointments = appointmentsResponse.data || [];
          const today = new Date().toDateString();
          
          setStats({
            totalPatients: [...new Set(appointments.map(a => a.patientId))].length,
            todayAppointments: appointments.filter(a => 
              new Date(a.appointmentDateTime).toDateString() === today
            ).length,
            completedAppointments: appointments.filter(a => a.status === "completed").length,
            pendingAppointments: appointments.filter(a => a.status === "pending").length,
          });

          // Get next upcoming appointment
          const upcoming = appointments
            .filter(a => a.status === "accepted" && new Date(a.appointmentDateTime) > new Date())
            .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))[0];
          
          if (upcoming) {
            setUpcomingAppointment(upcoming);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use mock data if API fails
        setDoctorData({
          id: 1,
          name: "Dr. Rajesh Kumar",
          email: "dr.rajesh@leafhomeo.com",
          mobile: "+91 98765 43210",
          specialization: "Homeopathy",
          qualification: "BHMS, MD",
          experience: "15 years",
        });

        setStats({
          totalPatients: 156,
          todayAppointments: 8,
          completedAppointments: 142,
          pendingAppointments: 5,
        });

        setUpcomingAppointment({
          id: 1,
          patientName: "Rahul Sharma",
          patientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
          appointmentDateTime: new Date().toISOString(),
          status: "Confirmed",
          reason: "Follow-up consultation for chronic migraine treatment",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openEditModal = () => {
    if (doctorData) {
      setEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDoctorData({ ...doctorData, ...doctorData });
      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      {/* Hero Section Card */}
      <div className="relative overflow-hidden bg-brand-dark rounded-2xl p-8 text-white shadow-lg mb-6 border border-white/5 animate-scaleUp">
        {/* Soft Background Radial Light */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl translate-x-12 -translate-y-12" />
        
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full mb-4">
          🌿 EXPERT HOMEOPATHY CARE
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold max-w-xl leading-tight tracking-tight font-sans">
          Your Practice, <span className="text-brand-primary font-black">ELEVATED</span> & Streamlined.
        </h2>
        <p className="text-white/80 text-xs sm:text-sm mt-3 max-w-xl font-medium leading-relaxed">
          Manage patient consultations, prescriptions, and appointments with advanced clinical precision. Traditional healing meets modern technology.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">
            View Patient Records
          </button>
        </div>
      </div>

      {/* Profile Actions Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-gray-900 tracking-tight">Profile Management</h4>
            <p className="text-xs text-gray-400 mt-0.5">Update your professional information</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-brand-primary/20"
            >
              <Edit size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Large Panel: Next Consultation Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-base font-extrabold text-gray-900 tracking-tight">Next Scheduled Consultation</h4>
            <button 
              onClick={() => navigate("/doctor/appointments")}
              className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          
          {upcomingAppointment ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                    <img 
                      src={upcomingAppointment.patientImage}
                      alt={upcomingAppointment.patientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{upcomingAppointment.patientName}</p>
                      <span className="text-[9px] font-extrabold bg-brand-primary text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {upcomingAppointment.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-primary font-bold mt-0.5">
                      Patient Consultation
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold mt-1">
                      <span>📅 {formatShortDate(upcomingAppointment.appointmentDateTime)}</span>
                      <span>⏰ {formatTime(upcomingAppointment.appointmentDateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 font-medium leading-relaxed bg-[#FDFEFC] p-4 rounded-xl border border-gray-100 mt-4">
                {upcomingAppointment.reason}
              </p>

              <button className="mt-5 w-full bg-brand-primary hover:bg-brand-hover text-white py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer">
                <Video className="h-4 w-4" /> Start Video Call
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Calendar className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Right Status Panel: Practice Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between shadow-xs">
          <h4 className="text-base font-extrabold text-gray-900 tracking-tight mb-5">Practice Overview</h4>
          
          <div className="space-y-3 flex-grow">
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/50 px-3 py-1 rounded-lg">{stats.pendingAppointments}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-brand-light/30 border border-brand-primary/10 rounded-xl">
              <span className="text-xs font-bold text-brand-dark flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span> Today
              </span>
              <span className="text-xs font-bold text-brand-primary bg-white border border-brand-primary/20 px-3 py-1 rounded-lg">{stats.todayAppointments}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Total Patients
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/50 px-3 py-1 rounded-lg">{stats.totalPatients}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Completed
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/50 px-3 py-1 rounded-lg">{stats.completedAppointments}</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Updated just now</span>
            <span className="flex items-center gap-1 text-brand-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span> Live
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && doctorData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={doctorData.name}
                  onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={doctorData.mobile}
                  onChange={(e) => setDoctorData({ ...doctorData, mobile: e.target.value })}
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
}

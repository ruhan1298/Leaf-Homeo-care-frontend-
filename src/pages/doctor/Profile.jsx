import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../../components/DoctorLayout";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit,
  Loader2,
  AlertCircle,
  Stethoscope,
  GraduationCap,
  Award,
  Lock,
  LogOut
} from "lucide-react";
import { getUser } from "../../api/authApi";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUser();
        if (response.status === 1) {
          setProfileData(response.data);
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Something went wrong. Please try again.");
        
        // Use mock data if API fails
        setProfileData({
          id: 1,
          name: "Dr. Rajesh Kumar",
          email: "dr.rajesh@leafhomeo.com",
          mobile: "+91 98765 43210",
          specialization: "Homeopathy",
          qualification: "BHMS, MD",
          experience: 15,
          consultationFee: "500.00",
          bio: "Experienced homeopathy doctor specializing in chronic diseases and lifestyle disorders.",
          IsExpert: true,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-gray-600">{error}</p>
        </div>
      </DoctorLayout>
    );
  }

  if (!profileData) {
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/doctor/login";
  };

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-500">View your professional information</p>
          </div>
          <button
            onClick={() => navigate("/doctor/profile/edit")}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-hover p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/30">
                <img
                  src={profileData.image}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-white/80 mt-1">Doctor ID: {profileData.id}</p>
                <p className="text-white/70 mt-1 text-sm">{profileData.specialization}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <User className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.name || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Mail className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Phone className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Mobile Number</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.mobile || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Calendar className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Joined Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(profileData.joinedDate)}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Stethoscope className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Specialization</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.specialization || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <GraduationCap className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Qualification</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.qualification || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Award className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Experience</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.experience ? `${profileData.experience} years` : "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <Award className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Consultation Fee</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(profileData.consultationFee)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <User className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Expert Status</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.IsExpert ? "Expert Doctor" : "Regular Doctor"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-light rounded-xl">
                    <User className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Bio</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.bio || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/doctor/profile/edit")}
            className="p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-brand-primary transition-all flex items-center gap-3"
          >
            <Edit className="h-5 w-5 text-brand-primary" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Edit Profile</p>
              <p className="text-xs text-gray-500">Update your professional information</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/doctor/profile/change-password")}
            className="p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-brand-primary transition-all flex items-center gap-3"
          >
            <Lock className="h-5 w-5 text-brand-primary" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500">Update your password</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-red-500 transition-all flex items-center gap-3"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Logout</p>
              <p className="text-xs text-gray-500">Sign out from your account</p>
            </div>
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}

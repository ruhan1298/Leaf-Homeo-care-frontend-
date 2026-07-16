import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Stethoscope,
  GraduationCap,
  Award,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getPublicDoctorProfile } from "../api/doctorApi";

export default function PublicDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPublicDoctorProfile(id);
        if (response.status === 1) {
          setProfileData(response.data);
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all"
        >
          Go to Login
        </button>
      </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Doctor Profile</h1>
          <p className="text-gray-500">View doctor's professional information</p>
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
                <p className="text-white/70 mt-1 text-sm">{profileData.specialization}</p>
                {profileData.IsExpert && (
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Expert Doctor
                  </span>
                )}
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
                    <p className="text-xs text-gray-400 font-semibold">Bio</p>
                    <p className="text-sm font-medium text-gray-900">{profileData.bio || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointment CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-hover transition-all"
          >
            Book Appointment
          </button>
          <p className="mt-2 text-sm text-gray-500">Create an account to book an appointment with this doctor</p>
        </div>
      </div>
    </div>
  );
}

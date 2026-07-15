import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import { getExpertDoctors } from "../../api/doctorApi";
import Swal from "sweetalert2";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Users,
  UserCheck,
  ArrowRight
} from "lucide-react";

export default function DoctorSelection() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getExpertDoctors();
      if (response.status === 1) {
        setDoctors(response.data || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to fetch doctors",
          confirmButtonColor: "#10b981"
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAnyDoctor = () => {
    navigate("/patient/book/any-doctor");
  };

  const handleBookSpecificDoctor = (doctor) => {
    navigate("/patient/book/doctor", { state: { selectedDoctor: doctor } });
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

  if (error) {
    return (
      <PatientLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDoctors}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-hover transition-all"
          >
            Retry
          </button>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book an Appointment</h1>
          <p className="text-gray-500">Choose how you'd like to book your consultation</p>
        </div>

        {/* Booking Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option A: Any Doctor */}
          <div
            onClick={handleBookAnyDoctor}
            className="group relative p-8 bg-gradient-to-br from-brand-light/30 to-purple-50 border-2 border-brand-primary/20 rounded-3xl cursor-pointer transition-all duration-300 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all" />
            
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-brand-light to-brand-primary/30 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-brand-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                Request to Any Available Doctor
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Submit your appointment request to all available doctors. The first available doctor will accept your request.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-brand-light text-brand-dark rounded-full text-xs font-bold border border-brand-primary/20">
                  ⚡ Fastest
                </span>
                <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-200">
                  Multiple Options
                </span>
              </div>
              
              <div className="flex items-center text-brand-primary font-bold group-hover:translate-x-2 transition-transform">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Option B: Specific Doctor */}
          <div
            onClick={() => document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' })}
            className="group relative p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-3xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-200 transition-all" />
            
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Choose a Specific Doctor
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Browse our expert homeopaths and select your preferred specialist for your appointment.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-200">
                  🎯 Specific
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
                  📅 Schedule
                </span>
              </div>
              
              <div className="flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
                Browse Doctors <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div id="doctors-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Our Expert Doctors</h2>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-gray-800 font-medium"
            />
          </div>

          {/* Doctors Grid */}
          {filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
              <AlertCircle className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No doctors found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300"
                >
                  {/* Doctor Image */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-light to-brand-primary/20 overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={doctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors text-lg">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-brand-primary font-semibold mt-1">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-gray-700">{doctor.rating || 4.8}</span>
                        <span className="text-xs text-gray-400">({doctor.reviews || 50} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-brand-primary" />
                      <span>{doctor.location || "Available Online"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-brand-primary" />
                      <span>{doctor.experience || "10+ years"} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">Qualification:</span>
                      <span>{doctor.qualification || "BHMS, MD"}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {doctor.bio || "Experienced homeopathy practitioner specializing in chronic ailments and holistic treatment."}
                  </p>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">Consultation Fee</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{doctor.consultationFee || 500}
                      </p>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookSpecificDoctor(doctor)}
                    className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    Book with {doctor.name.split(' ')[1] || 'Doctor'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}

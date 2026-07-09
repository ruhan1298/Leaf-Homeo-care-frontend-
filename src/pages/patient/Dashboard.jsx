import React, { useState, useEffect } from "react";
import BookingFlowModal from "../../components/BookingFlowModal";
import PatientLayout from "../../components/PatientLayout";
import { Video, Star, Calendar, Package, MessageSquare, ArrowRight, ArrowLeft, Clock, ShieldAlert, User, Mail, Phone, MapPin, Edit, Trash2, X, Save } from "lucide-react";
import { updatePatient, deletePatient, getPatientProfile } from "../../api/patientApi";

const TOP_DOCTORS = [
  { id: "doc-1", name: "Dr. Julian Thorne", specialty: "Chronic Ailments Specialist", rating: 4.9, reviews: 120, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80" },
  { id: "doc-2", name: "Dr. Elena Rossi", specialty: "Pediatric Homeopathy", rating: 4.8, reviews: 84, image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=250&q=80" },
  { id: "doc-3", name: "Dr. Marcus Chen", specialty: "Immunity & Vitality", rating: 5.0, reviews: 210, image: "https://images.unsplash.com/photo-1536368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80" },
  { id: "doc-4", name: "Dr. Ananya Iyer", specialty: "Mind-Body Wellness", rating: 4.7, reviews: 156, image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=250&q=80" },
];

export default function PatientDashboard() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const openBookingModal = (doc = null) => {
    setSelectedDoctor(doc);
    setBookingModalOpen(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updatePatient(patientData);
      if (response.status === 1) {
        alert("Profile updated successfully!");
        setEditModalOpen(false);
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setLoading(true);
        const response = await deletePatient(patientData.id);
        if (response.status === 1) {
          alert("Account deleted successfully");
          localStorage.clear();
          window.location.href = "/";
        } else {
          alert(response.message || "Failed to delete account");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const patientId = decoded.patientId;
        
        const response = await getPatientProfile(patientId);
        if (response.status === 1) {
          const data = response.data;
          setPatientData({
            id: data.id,
            name: data.user?.name || "",
            email: data.user?.email || "",
            mobile: data.user?.mobile || "",
            gender: data.gender || "",
            dob: data.dob || "",
            houseNumber: data.houseNumber || "",
            addressLine1: data.addressLine1 || "",
            addressLine2: data.addressLine2 || "",
            landmark: data.landmark || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
            country: data.country || "",
          });
          setEditModalOpen(true);
        } else {
          alert(response.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Something went wrong");
      }
    }
  };

  return (
    <PatientLayout>
      {/* Hero Section Card */}
      <div className="relative overflow-hidden bg-brand-dark rounded-2xl p-8 text-white shadow-lg mb-6 border border-white/5 animate-scaleUp">
        {/* Soft Background Radial Light */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl translate-x-12 -translate-y-12" />
        
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full mb-4">
          🌿 NEW ERA OF HEALING
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold max-w-xl leading-tight tracking-tight font-sans">
          Your Health Journey, <span className="text-brand-primary font-black">SIMPLIFIED</span> & Personalized.
        </h2>
        <p className="text-white/80 text-xs sm:text-sm mt-3 max-w-xl font-medium leading-relaxed">
          Connect with world-class homeopathy experts through high-definition video consultations. Advanced clinical precision meets traditional botanical wisdom.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => openBookingModal(null)}
            className="bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> New Booking
          </button>
          <button className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">
            View Medical Records
          </button>
        </div>
      </div>

      {/* Profile Actions Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-gray-900 tracking-tight">Profile Management</h4>
            <p className="text-xs text-gray-400 mt-0.5">Update your personal information or delete your account</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-brand-primary/20"
            >
              <Edit size={14} /> Edit Profile
            </button>
            <button
              onClick={handleDeletePatient}
              disabled={loading}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 3 Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => openBookingModal(null)}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs cursor-pointer hover:shadow-md hover:border-brand-primary/20 transition-all group"
        >
          <div className="p-3 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10 group-hover:scale-105 transition-transform"><Calendar className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">Book Appointment</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Find a slot that works for you</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs cursor-pointer hover:shadow-md hover:border-brand-primary/20 transition-all group">
          <div className="p-3 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10 group-hover:scale-105 transition-transform"><MessageSquare className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">Chat Doctor</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Immediate help for symptoms</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs cursor-pointer hover:shadow-md hover:border-brand-primary/20 transition-all group">
          <div className="p-3 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10 group-hover:scale-105 transition-transform"><Package className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">Track Medicines</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Your current dosage schedule</p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Consultation Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Large Panel: Next Consultation Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-base font-extrabold text-gray-900 tracking-tight">Next Scheduled Consultation</h4>
            <button className="text-xs font-bold text-brand-primary hover:underline cursor-pointer">View All</button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/60">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80" 
                  alt="Dr. Sarah Ahmed" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">Dr. Sarah Ahmed</p>
                  <span className="text-[9px] font-extrabold bg-brand-primary text-white px-2 py-0.5 rounded-md uppercase tracking-wider">In 1 hr</span>
                </div>
                <p className="text-xs text-brand-primary font-bold mt-0.5">Senior Homeopathy Consultant — Clinical Wellness</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold mt-1">
                  <span>📅 Oct 24, 2026</span>
                  <span>⏰ 10:30 AM - 11:00 AM</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 font-medium leading-relaxed bg-[#FDFEFC] p-4 rounded-xl border border-gray-100 mt-4">
            "Last session we discussed your vitality levels. Please have your symptom tracker ready for today's review."
          </p>

          <button className="mt-5 w-full bg-brand-primary hover:bg-brand-hover text-white py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer">
            <Video className="h-4 w-4" /> Start Video Call
          </button>
        </div>

        {/* Right Status Panel: Consultation Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between shadow-xs">
          <h4 className="text-base font-extrabold text-gray-900 tracking-tight mb-5">Consultation Overview</h4>
          
          <div className="space-y-3 flex-grow">
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending Slots
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/50 px-3 py-1 rounded-lg">02</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-brand-light/30 border border-brand-primary/10 rounded-xl">
              <span className="text-xs font-bold text-brand-dark flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span> Active Treatment
              </span>
              <span className="text-xs font-bold text-brand-primary bg-white border border-brand-primary/20 px-3 py-1 rounded-lg">01</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Completed
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/50 px-3 py-1 rounded-lg">14</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1"><ShieldAlert size={14} className="text-brand-primary" /> Health Goals Completed</span>
            <span className="text-brand-primary font-extrabold text-sm">78%</span>
          </div>
        </div>
      </div>

      {/* Doctor Slider */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900 tracking-tight">Highly Rated Homeopathy Doctors</h4>
            <p className="text-xs text-gray-400">Book consultations with our expert panel</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer"><ArrowLeft className="h-4 w-4" /></button>
            <button className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_DOCTORS.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-3.5 flex flex-col items-center">
                <div className="w-full aspect-square max-h-40 rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>

                <div className="text-center space-y-1">
                  <h5 className="font-bold text-gray-900 text-sm">{doc.name}</h5>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wide bg-brand-light px-2.5 py-0.5 rounded-md inline-block border border-brand-primary/10">
                    {doc.specialty}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doc.rating}
                  <span className="text-gray-400 font-medium">({doc.reviews} reviews)</span>
                </div>
              </div>

              <div className="mt-5">
                <button 
                  onClick={() => openBookingModal(doc)}
                  className="w-full py-2.5 bg-white border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingFlowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedDoctor={selectedDoctor}
      />

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Edit Profile</h3>
                <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdatePatient} className="p-6 space-y-4">
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Personal Information</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={patientData?.name || ""}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={patientData?.email || ""}
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      value={patientData?.mobile || ""}
                      onChange={(e) => setPatientData({ ...patientData, mobile: e.target.value })}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Gender</label>
                    <select
                      value={patientData?.gender || ""}
                      onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Date of Birth</label>
                    <input
                      type="date"
                      value={patientData?.dob || ""}
                      onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Address Information</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">House Number</label>
                  <input
                    type="text"
                    value={patientData?.houseNumber || ""}
                    onChange={(e) => setPatientData({ ...patientData, houseNumber: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Address Line 1</label>
                  <input
                    type="text"
                    value={patientData?.addressLine1 || ""}
                    onChange={(e) => setPatientData({ ...patientData, addressLine1: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Address Line 2</label>
                  <input
                    type="text"
                    value={patientData?.addressLine2 || ""}
                    onChange={(e) => setPatientData({ ...patientData, addressLine2: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Landmark</label>
                  <input
                    type="text"
                    value={patientData?.landmark || ""}
                    onChange={(e) => setPatientData({ ...patientData, landmark: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      value={patientData?.city || ""}
                      onChange={(e) => setPatientData({ ...patientData, city: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">State</label>
                    <input
                      type="text"
                      value={patientData?.state || ""}
                      onChange={(e) => setPatientData({ ...patientData, state: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Pincode</label>
                    <input
                      type="text"
                      value={patientData?.pincode || ""}
                      onChange={(e) => setPatientData({ ...patientData, pincode: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Country</label>
                    <input
                      type="text"
                      value={patientData?.country || ""}
                      onChange={(e) => setPatientData({ ...patientData, country: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
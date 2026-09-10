import React from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import {
  Users,
  UserCheck,
  ArrowRight
} from "lucide-react";

export default function BookAppointment() {
  const navigate = useNavigate();

  const handleBookAnyDoctor = () => {
    navigate("/patient/book/any-doctor");
  };

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
            onClick={() => navigate("/patient/doctors?showList=true")}
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
      </div>
    </PatientLayout>
  );
}

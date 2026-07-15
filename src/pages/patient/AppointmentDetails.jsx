import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PatientLayout from "../../components/PatientLayout";
import { getAvailabilitySlots, bookAppointment } from "../../api/appointmentApi";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  Video
} from "lucide-react";

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDoctor = location.state?.selectedDoctor;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDoctor) {
      navigate("/patient/doctors");
    }
  }, [selectedDoctor, navigate]);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      setError(null);
      const response = await getAvailabilitySlots(selectedDoctor.id, selectedDate);
      if (response.status === 1) {
        // The API returns slots with availability status
        setAvailableSlots(response.slots || []);
      } else {
        setError(response.message || "Failed to fetch available slots");
      }
    } catch (err) {
      setError("Failed to fetch available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !symptoms) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);

      const appointmentDateTime = `${selectedDate} ${selectedTime}`;
      
      const bookingData = {
        doctorId: selectedDoctor.id,
        requestType: "specific_doctor",
        appointmentDateTime,
        reason: symptoms
      };

      const response = await bookAppointment(bookingData);
      
      if (response.status === 1) {
        navigate("/patient/appointments", { 
          state: { 
            bookingSuccess: true,
            message: "Appointment request sent to Dr. " + selectedDoctor.name + "! You will be notified when they accept." 
          } 
        });
      } else {
        setError(response.message || "Failed to book appointment");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (!selectedDoctor) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/patient/doctors")}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Doctors
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Appointment with Dr. {selectedDoctor.name}</h1>
          <p className="text-gray-500">Select your preferred date and time from the available slots</p>
        </div>

        {/* Selected Doctor Info */}
        <div className="bg-gradient-to-r from-brand-light/30 to-purple-50 rounded-2xl p-6 border border-brand-primary/20 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
              <img
                src={selectedDoctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"}
                alt={selectedDoctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{selectedDoctor.name}</h3>
              <p className="text-sm text-brand-primary font-semibold">{selectedDoctor.specialization}</p>
              <p className="text-sm text-gray-600 mt-1">Consultation Fee: ₹{selectedDoctor.consultationFee || 500}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Selection */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-primary" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
                setAvailableSlots([]);
              }}
              min={today}
              required
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-gray-800 font-medium"
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-primary" />
                Available Time Slots
              </label>
              
              {loadingSlots ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-red-200 rounded-2xl text-red-500">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                  <Calendar className="h-8 w-8 mb-2" />
                  <p className="text-sm">No available slots for this date. Please try another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedTime === slot.time
                          ? "border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                          : slot.available
                          ? "border-gray-200 hover:border-brand-primary hover:bg-brand-light/30 text-gray-700"
                          : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Symptoms */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              Describe Your Symptoms
            </label>
            <textarea
              required
              rows={5}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms or health concern in detail..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-gray-800 resize-none font-medium"
            />
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <Video className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800 font-medium">
              Consultations are conducted via secure video call. Please ensure you have a stable internet connection and are available at the scheduled time.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={bookingLoading || !selectedTime || !symptoms}
            className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Submit Request to Dr. {selectedDoctor.name.split(' ')[1] || 'Doctor'}
              </>
            )}
          </button>
        </form>
      </div>
    </PatientLayout>
  );
}

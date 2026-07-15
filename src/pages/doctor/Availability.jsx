import React, { useState, useEffect } from "react";
import DoctorLayout from "../../components/DoctorLayout";
import { 
  Clock, 
  Loader2, 
  Calendar, 
  Save,
  Check
} from "lucide-react";
import { getDoctorAvailability, addAvailability } from "../../api/doctorApi";
import Swal from "sweetalert2";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday", 
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
};

export default function Availability() {
  const [weeklyAvailability, setWeeklyAvailability] = useState(
    DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day,
      isAvailable: false,
      startTime: "",
      endTime: ""
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await getDoctorAvailability();
      if (response.status === 1 && response.data) {
        const availabilityMap = {};
        response.data.forEach(slot => {
          availabilityMap[slot.dayOfWeek] = {
            isAvailable: true,
            startTime: slot.startTime ? slot.startTime.substring(0, 5) : "",
            endTime: slot.endTime ? slot.endTime.substring(0, 5) : ""
          };
        });

        setWeeklyAvailability(
          DAYS_OF_WEEK.map(day => ({
            dayOfWeek: day,
            isAvailable: availabilityMap[day]?.isAvailable || false,
            startTime: availabilityMap[day]?.startTime || "",
            endTime: availabilityMap[day]?.endTime || ""
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayOfWeek) => {
    setWeeklyAvailability(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, isAvailable: !day.isAvailable }
          : day
      )
    );
  };

  const handleTimeChange = (dayOfWeek, field, value) => {
    setWeeklyAvailability(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, [field]: value }
          : day
      )
    );
  };

  const handleSaveAvailability = async () => {
    const availableDays = weeklyAvailability.filter(day => day.isAvailable);
    
    if (availableDays.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Availability",
        text: "Please enable at least one day for availability",
        confirmButtonColor: "#00b100"
      });
      return;
    }

    const invalidDays = availableDays.filter(day => !day.startTime || !day.endTime);
    if (invalidDays.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Time",
        text: "Please set both start and end time for all enabled days",
        confirmButtonColor: "#00b100"
      });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        availability: availableDays.map(day => ({
          dayOfWeek: day.dayOfWeek,
          startTime: `${day.startTime}:00`,
          endTime: `${day.endTime}:00`
        }))
      };

      const response = await addAvailability(payload.availability);
      if (response.status === 1) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Availability saved successfully",
          confirmButtonColor: "#00b100"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to save availability",
          confirmButtonColor: "#00b100"
        });
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#00b100"
      });
    } finally {
      setSaving(false);
    }
  };

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Weekly Availability</h1>
          <p className="text-gray-500">Set your available days and time slots for appointments</p>
        </div>

        {/* Info Card */}
        <div className="bg-brand-light/30 border border-brand-primary/10 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How it works</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enable the days you're available and set your working hours for each day. 
                Patients can only book appointments during your configured time slots.
              </p>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {weeklyAvailability.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`bg-white border-2 rounded-2xl p-5 transition-all ${
                day.isAvailable 
                  ? 'border-brand-primary/30 shadow-sm' 
                  : 'border-gray-100'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    day.isAvailable ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{DAY_LABELS[day.dayOfWeek]}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.isAvailable}
                    onChange={() => handleToggleDay(day.dayOfWeek)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
              </div>

              {/* Time Pickers */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => handleTimeChange(day.dayOfWeek, 'startTime', e.target.value)}
                    disabled={!day.isAvailable}
                    className="w-full h-10 px-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => handleTimeChange(day.dayOfWeek, 'endTime', e.target.value)}
                    disabled={!day.isAvailable}
                    className="w-full h-10 px-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveAvailability}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}

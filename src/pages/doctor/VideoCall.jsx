import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoCall from "../../components/VideoCall";

const DoctorVideoCall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const handleEndCall = () => {
    navigate("/doctor/appointments");
  };

  if (!appointmentId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Appointment ID is required</p>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Appointments
          </button>
        </div>
      </div>
    );
  }

  return <VideoCall appointmentId={appointmentId} onEndCall={handleEndCall} userType="doctor" />;
};

export default DoctorVideoCall;

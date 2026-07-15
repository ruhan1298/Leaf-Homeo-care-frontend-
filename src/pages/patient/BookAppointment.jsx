import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new Doctor Selection page
    navigate("/patient/doctors");
  }, [navigate]);

  return null;
}

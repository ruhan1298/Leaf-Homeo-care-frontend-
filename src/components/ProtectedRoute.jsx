import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, requireCompleteProfile = false, allowedRole = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      const userRole = user.role;

      console.log("=== ProtectedRoute Debug ===");
      console.log("Token present:", !!token);
      console.log("User from sessionStorage:", user);
      console.log("user.role from user object:", user.role);
      console.log("Allowed role:", allowedRole);

      setIsAuthenticated(!!token);
      setUserRole(userRole);

      if (requireCompleteProfile && userRole === "patient") {
        setIsProfileComplete(user.IsCompleteProfile !== false);
      } else {
        setIsProfileComplete(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [requireCompleteProfile]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRole && userRole !== allowedRole) {
    console.log("=== Role Mismatch ===");
    console.log("User role:", userRole);
    console.log("Allowed role:", allowedRole);
    console.log("Redirecting based on user role...");
    
    // Redirect to appropriate dashboard based on user's role
    if (userRole === "doctor") {
      console.log("Redirecting to doctor dashboard");
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (userRole === "patient") {
      console.log("Redirecting to patient dashboard");
      return <Navigate to="/patient/dashboard" replace />;
    } else if (userRole === "admin") {
      console.log("Redirecting to admin dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      console.log("Redirecting to login");
      return <Navigate to="/login" replace />;
    }
  }

  if (requireCompleteProfile && !isProfileComplete) {
    return <Navigate to="/patient/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;

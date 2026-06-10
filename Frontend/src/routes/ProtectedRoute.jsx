import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, isLoading } = useAuth0();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (isLoading) return <p>Loading...</p>;

  // Patient Google login allowed only for patient route
  if (isAuthenticated && allowedRole === "patient") {
    return children;
  }

  // JWT login required for admin/doctor/patient normal login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // JWT role protection
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Tumhare project me:

// Patient login → JWT se
// Doctor login → JWT se
// Admin login → JWT se
// Google Login → sirf Patient ke liye

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // ⚡ Loading while auth check
  }

  if (!user.token) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;

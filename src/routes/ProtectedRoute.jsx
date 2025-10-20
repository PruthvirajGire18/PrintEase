import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles, loading }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // ⚡ Loading while auth check
  }

  if (!token) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;

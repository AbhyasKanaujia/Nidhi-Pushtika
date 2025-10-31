import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

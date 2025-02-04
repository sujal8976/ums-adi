import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { CenterWrapper } from "@/components/custom ui/center-page";
import { Loader } from "@/components/custom ui/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(true);
  const location = useLocation();

  // If still loading authentication status, show loader
  if (isLoading) {
    return (
      <CenterWrapper>
        <Loader />
      </CenterWrapper>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

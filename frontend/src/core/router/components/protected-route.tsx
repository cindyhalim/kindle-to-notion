import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Routes } from "../routes";

interface IProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  isAuthenticated,
}) =>
  isAuthenticated ? <Outlet /> : <Navigate to={Routes.HOME} replace={true} />;

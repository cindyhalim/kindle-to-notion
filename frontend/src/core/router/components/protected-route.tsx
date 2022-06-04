import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../../auth/utils";
import { RoutesEnum } from "../routes";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = getAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={RoutesEnum.HOME} />;
};

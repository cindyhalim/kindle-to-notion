import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RoutesEnum } from "../routes";

interface IProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  isAuthenticated,
}) =>
  isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={RoutesEnum.HOME} replace={true} />
  );

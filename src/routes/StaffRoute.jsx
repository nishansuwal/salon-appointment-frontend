import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function StaffRoute() {
  const { isAuthenticated, isStaff } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/" replace />;

  return <Outlet />;
}

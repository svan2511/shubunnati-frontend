import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ permission }) {
  const token = sessionStorage.getItem("auth_token");
    const {  userPermissions , permissionsLoaded } = useSelector(
    (state) => state.loggedUser
  );

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!permissionsLoaded) {
    return null; // or loader
  }

   if (permission && !userPermissions?.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
}

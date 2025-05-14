import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const role = localStorage.getItem("userRole");

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;


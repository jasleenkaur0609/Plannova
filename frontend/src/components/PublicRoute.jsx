import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

const PublicRoute = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // If user is already logged in, redirect based on their role
  if (user) {
    const role = localStorage.getItem("userRole");
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "vendor") return <Navigate to="/vendor/dashboard" replace />;
    if (role === "customer") return <Navigate to="/customer/dashboard" replace />;
  }

  // Otherwise allow access to the public route
  return <Outlet />;
};

export default PublicRoute;

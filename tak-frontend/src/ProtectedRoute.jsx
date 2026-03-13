import { Navigate, Outlet, useParams } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const { id } = useParams();
  const stored = JSON.parse(localStorage.getItem("LoggedInUserTakshila"));

  if (!stored) {
    return <Navigate to="/" replace />;
  }

  const { userId, userRole } = stored;

  // role check
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // id check (VERY IMPORTANT)
  if (id !== userId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

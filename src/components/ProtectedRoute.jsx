// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, roles }) {
//   const { user, role, loading } = useAuth();

//   if (loading) return <div className="page-loading">جارٍ التحميل...</div>;
//   if (!user) return <Navigate to="/login" replace />;
//   if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

//   return children;
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
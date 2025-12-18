import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("user_token");
  const userRaw = localStorage.getItem("user_data");

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 👇 usa EL CAMPO REAL que viene del backend
  if (!user.isAdmin && user.role !== "admin" && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

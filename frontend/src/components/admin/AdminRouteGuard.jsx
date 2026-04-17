import { Navigate, Outlet } from "react-router-dom";

function AdminRouteGuard() {
  const token = localStorage.getItem("adminToken");
  const adminUserRaw = localStorage.getItem("adminUser");
  const adminUser = adminUserRaw ? JSON.parse(adminUserRaw) : null;

  if (!token || !adminUser || adminUser.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminRouteGuard;

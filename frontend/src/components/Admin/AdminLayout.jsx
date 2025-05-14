// src/layouts/VendorLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="w-64">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-6 bg-[#F7E1D7]">
        <Outlet />
      </div>
    </div>
  );
}

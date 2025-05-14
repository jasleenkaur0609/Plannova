import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar"; // Your custom sidebar component

export default function VendorLayout() {
  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

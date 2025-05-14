import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsCalendarEventFill,
  BsFillCalendarCheckFill,
} from "react-icons/bs";
import {
  MdDashboard,
  MdDesignServices,
  MdOutlineSwapHoriz,
  MdPayment,
} from "react-icons/md";
import { FaStore, FaUsers } from "react-icons/fa";
import { logoutUser } from "../../utils/auth";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
    { label: "Vendors", path: "/admin/vendor-list", icon: <FaStore /> },
    { label: "Users", path: "/admin/user-list", icon: <FaUsers /> },
    { label: "Events", path: "/admin/event-list", icon: <BsCalendarEventFill /> },
    { label: "Services", path: "/admin/services", icon: <MdDesignServices /> },
    { label: "Transactions", path: "/admin/transactions", icon: <MdOutlineSwapHoriz /> },
    { label: "Payments", path: "/admin/payments", icon: <MdPayment /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#4A5759] text-[#F7E1D7] flex flex-col justify-between shadow-lg z-50">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-5 border-b border-[#B0C4B1]">
          <BsCalendarEventFill className="text-[#EDAFB8] text-2xl" />
          <h1 className="text-xl font-bold text-[#EDAFB8] tracking-wide">
            Plannova
          </h1>
        </div>

        {/* Role Label */}
        <div className="text-center text-xs font-semibold uppercase tracking-widest text-[#DEDBD2] mt-3">
          Admin
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {menuItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#B0C4B1] text-[#4A5759]"
                    : "hover:bg-[#DEDBD2] hover:text-[#4A5759]"
                }`}
              >
                <span className={`text-lg ${isActive ? "animate-bounce" : ""}`}>
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#B0C4B1]">
        <button
          onClick={() => logoutUser(navigate)}
          className="w-full flex items-center gap-3 py-2 px-3 text-sm font-semibold bg-[#EDAFB8] text-[#4A5759] rounded hover:bg-[#F7E1D7] transition-all"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

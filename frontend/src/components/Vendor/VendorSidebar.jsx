import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  CalendarClock,
  DollarSign,
  Star,
  User,
  UserCog,
  LogOut
} from "lucide-react";
import {
  BsCalendarEventFill,
  BsFillCalendarCheckFill,
} from "react-icons/bs";
import { logoutUser } from "../../utils/auth";

const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[#B0C4B1] hover:text-[#4A5759] text-sm font-medium ${
        isActive ? "bg-[#B0C4B1] text-[#4A5759]" : "text-[#DEDBD2]"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

const VendorSidebar = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7E1D7]">
      <aside className="w-64 bg-[#4A5759] p-6 flex flex-col justify-between">
        {/* Logo */}
        <div>
          <div className="p-4 border-b border-[#B0C4B1] flex items-center gap-2">
          <BsCalendarEventFill className="text-[#EDAFB8] text-2xl" />
          <h1 className="text-xl font-extrabold text-[#EDAFB8]">Plannova</h1>
        </div>

        {/* Role Label */}
        <p className="text-center text-[#DEDBD2] text-xs font-semibold uppercase mt-2 mb-10">
          Vendor
        </p>

    {/* Sidebar links */}
    <SidebarLink to="/vendor/dashboard" icon={LayoutDashboard} label="Dashboard" />
    <SidebarLink to="/vendor/services" icon={Briefcase} label="My Services" />
    <SidebarLink to="/vendor/bookings" icon={UserCog} label="Manage Bookings" />
    <SidebarLink to="/vendor/earnings" icon={DollarSign} label="Earnings" />
    <SidebarLink to="/vendor/reviews" icon={Star} label="Reviews About Me" />
    <SidebarLink to="/vendor/profile" icon={User} label="My Profile" />
  </div>

  {/* Logout button */}
  <button
  onClick={() => logoutUser(navigate)}
  className="w-full bg-[#EDAFB8] text-[#4A5759] font-semibold py-2 rounded-lg hover:bg-[#f4c1ca] transition duration-200 flex items-center justify-center gap-2"
>
  <LogOut size={18} />
  Logout
</button>

</aside>


      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default VendorSidebar;

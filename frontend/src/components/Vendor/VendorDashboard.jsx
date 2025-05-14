import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const VendorDashboard = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role) {
      localStorage.setItem("userRole", role);
    }
  }, [location]);

  const data = [
    { month: "Jan", bookings: 12, earnings: 15000 },
    { month: "Feb", bookings: 18, earnings: 22000 },
    { month: "Mar", bookings: 25, earnings: 30000 },
    { month: "Apr", bookings: 22, earnings: 27000 },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#F7E1D7] min-h-screen">
      <h1 className="text-3xl font-bold text-[#4A5759] mb-6">Vendor Dashboard</h1>

      <div className="bg-white rounded-2xl shadow-xl border border-[#DEDBD2] p-6">
        <h2 className="text-xl font-semibold text-[#4A5759] mb-4">Monthly Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#B0C4B1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="earnings" fill="#EDAFB8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorDashboard;

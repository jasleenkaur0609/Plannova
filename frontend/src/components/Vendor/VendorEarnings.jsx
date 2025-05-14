import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const VendorEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [completedEarnings, setCompletedEarnings] = useState(0);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();
      const res = await fetch(`${baseUrl}/vender/completed-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEarnings(data);

      setTotalEarnings(data.reduce((sum, e) => sum + e.amount, 0));
      setPendingEarnings(data.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0));
      setCompletedEarnings(data.filter(e => e.status === "paid").reduce((sum, e) => sum + e.amount, 0));
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const filteredEarnings =
    filter === "All" ? earnings : earnings.filter(e => e.status === filter.toLowerCase());

  return (
    <div className="p-6 space-y-10 bg-[#DEDBD2] h-full">
      <h1 className="text-3xl font-bold text-center text-[#4A5759]">Vendor Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#4A5759] shadow-md rounded-2xl p-5 text-center">
          <h2 className="text-lg font-semibold text-[#F7E1D7]">Total Earnings</h2>
          <p className="text-2xl font-bold text-white">₹{totalEarnings}</p>
        </div>

        <div className="bg-[#4A5759] shadow-md rounded-2xl p-5 text-center">
          <h2 className="text-lg font-semibold text-[#F7E1D7]">Pending Earnings</h2>
          <p className="text-2xl font-bold text-yellow-400">₹{pendingEarnings}</p>
        </div>

        <div className="bg-[#4A5759] shadow-md rounded-2xl p-5 text-center">
          <h2 className="text-lg font-semibold text-[#F7E1D7]">Completed Earnings</h2>
          <p className="text-2xl font-bold text-green-400">₹{completedEarnings}</p>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="flex justify-center mt-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#F7E1D7] border border-[#4A5759] text-[#4A5759] text-sm rounded-lg focus:ring-[#4A5759] focus:border-[#4A5759] p-2.5"
        >
          <option value="All">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Earnings Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-[#EDAFB8] text-[#4A5759]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="bg-[#F7E1D7] text-[#4A5759]">
            {filteredEarnings.length > 0 ? (
              filteredEarnings.map((earning) => (
                <tr
                  key={earning._id}
                  className="border-t border-gray-300 hover:bg-[#DEDBD2] transition-colors"
                >
                  <td className="px-4 py-3">{earning.customerName || "N/A"}</td>
                  <td className="px-4 py-3">{earning.eventName || "N/A"}</td>
                  <td className="px-4 py-3">{earning.serviceName || "N/A"}</td>
                  <td className="px-4 py-3 font-medium">₹{earning.amount}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      earning.status === "paid"
                        ? "text-green-600"
                        : earning.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(earning.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-[#4A5759]">
                  No {filter.toLowerCase()} earnings to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorEarnings;


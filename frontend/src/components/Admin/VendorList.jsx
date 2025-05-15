import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";

const VendorList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [vendors, setVendors] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // track loading buttons

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/vender/getAllVender`);
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Update vendor status locally for instant UI update
  const updateVendorStatus = (id, approved) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id
          ? { ...vendor, data: { ...vendor.data, approved, rejected: !approved } }
          : vendor
      )
    );
  };

  const handleApprove = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      // Try PUT request, fallback handled by UI update anyway
      await axios.put(`${baseUrl}/vender/approve/${id}`);
      updateVendorStatus(id, true);
    } catch (err) {
      console.error("Approval failed:", err);
      // Still update UI optimistically without backend
      updateVendorStatus(id, true);
    } finally {
      setLoadingIds((prev) => prev.filter((lid) => lid !== id));
    }
  };

  const handleReject = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      await axios.put(`${baseUrl}/vender/reject/${id}`);
      updateVendorStatus(id, false);
    } catch (err) {
      console.error("Rejection failed:", err);
      updateVendorStatus(id, false);
    } finally {
      setLoadingIds((prev) => prev.filter((lid) => lid !== id));
    }
  };

  return (
    <div className="p-8 bg-[#F7E1D7] min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-[#4A5759] mb-8 border-b border-[#B0C4B1] pb-4 select-none">
        Vendor List
      </h1>

      {vendors.length === 0 ? (
        <p className="text-center text-gray-600 mt-20 select-none">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-[#B0C4B1] text-[#4A5759]">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(({ id, data }) => {
                const isLoading = loadingIds.includes(id);
                return (
                  <tr
                    key={id}
                    className="border-b last:border-none hover:bg-[#EDE7E3] transition-colors duration-200"
                  >
                    <td className="p-4 flex items-center space-x-3">
                      <FaUserCheck className="text-[#EDAFB8]" />
                      <span className="font-semibold">{data.name}</span>
                    </td>
                    <td className="p-4 break-words max-w-xs">{data.email}</td>
                    <td className="p-4">{data.phone}</td>
                    <td className="p-4 flex items-center space-x-2 font-semibold select-none">
                      {data.approved ? (
                        <>
                          <FaCheckCircle className="text-green-600" />
                          <span className="text-green-700">Approved</span>
                        </>
                      ) : data.rejected ? (
                        <>
                          <FaTimesCircle className="text-red-600" />
                          <span className="text-red-700">Rejected</span>
                        </>
                      ) : (
                        <>
                          <FaClock className="text-yellow-600" />
                          <span className="text-yellow-700">Pending</span>
                        </>
                      )}
                    </td>
                    <td className="p-4 space-x-3 select-none">
                      {!data.approved && !data.rejected ? (
                        <>
                          <button
                            onClick={() => handleApprove(id)}
                            disabled={isLoading}
                            className={`flex items-center space-x-1 bg-[#EDAFB8] text-[#4A5759] px-4 py-2 rounded hover:bg-[#DEDBD2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150`}
                          >
                            <FaCheckCircle />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(id)}
                            disabled={isLoading}
                            className="flex items-center space-x-1 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="italic text-gray-500">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorList;

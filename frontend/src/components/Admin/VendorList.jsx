// pages/VendorList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [vendors, setVendors] = useState([]);

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

  const handleApprove = async (id) => {
    try {
      await axios.put(`${baseUrl}/vender/approve/${id}`);
      fetchVendors();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${baseUrl}/vender/reject/${id}`);
      fetchVendors();
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  return (
    <div className=" p-4 bg-[#F7E1D7] min-h-screen">
      <div className="flex-1 p-8 bg-[#F7E1D7] min-h-screen">
        <h1 className="text-3xl font-bold text-[#4A5759] mb-6">Vendor List</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-[#B0C4B1] text-[#4A5759]">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t hover:bg-[#f0f0f0]">
                    <td className="p-3">{vendor.data.name}</td>
                    <td className="p-3">{vendor.data.email}</td>
                    <td className="p-3">{vendor.data.phone}</td>
                    <td className="p-3">
                      {vendor.data.approved ? (
                        <span className="text-green-600 font-medium">Approved</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      {!vendor.data.approved && (
                        <>
                          <button
                            onClick={() => handleApprove(vendor.id)}
                            className="bg-[#EDAFB8] text-[#4A5759] px-3 py-1 rounded hover:bg-[#DEDBD2]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(vendor.id)}
                            className="bg-yellow-400 text-[#4A5759] px-3 py-1 rounded hover:bg-yellow-300"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorList;

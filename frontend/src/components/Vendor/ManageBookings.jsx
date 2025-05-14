import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchBookings = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${baseUrl}/vender/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      // Show confirmation dialog before proceeding with the status change
      const result = await Swal.fire({
        title: `Are you sure you want to mark this booking as ${status}?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4A5759",
        cancelButtonColor: "#EDAFB8",
        confirmButtonText: `Yes, ${status}!`,
        cancelButtonText: "Cancel",
      });
  
      if (result.isConfirmed) {
        // Proceed with the status change if confirmed
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${baseUrl}/vender/bookings`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId, status }),
        });
  
        if (res.ok) {
          // Remove completed bookings from list; otherwise, update the status
          if (status === "Completed") {
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            Swal.fire({
              icon: "success",
              title: "Booking Completed",
              text: "The booking status has been updated to completed.",
              confirmButtonColor: "#4A5759",
            });
          } else {
            setBookings((prev) =>
              prev.map((booking) =>
                booking._id === bookingId ? { ...booking, status } : booking
              )
            );
            Swal.fire({
              icon: "success",
              title: "Booking Status Updated",
              text: `The booking has been marked as ${status}.`,
              confirmButtonColor: "#4A5759",
            });
          }
        } else {
          throw new Error("Failed to update the booking status.");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Update Status",
        text: error.message || "An error occurred while updating the booking status.",
        confirmButtonColor: "#EDAFB8",
      });
    }
  };
  

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#DEDBD2] max-h-screen max-w-screen overflow-auto h-full">
      <h1 className="text-4xl font-bold text-[#4A5759] text-center">
        📋 Manage Bookings
      </h1>
      {/*<div className="border-t border-[#B0C4B1] mb-4"></div>*/}

      <div className="flex justify-end">
        <select
          className="mb-4 px-4 py-2 border border-[#EDAFB8] rounded-md bg-[#F7E1D7] text-[#4A5759] focus:outline-none focus:ring-2 focus:ring-[#EDAFB8]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#F7E1D7] border border-[#EDAFB8] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-[#4A5759] space-y-4"
            >
              <h2 className="text-2xl font-bold tracking-tight text-center">
                {booking.serviceName}
              </h2>
              <p className="text-center italic text-lg font-medium">
                for <span className="font-semibold">{booking.eventName}</span>
              </p>

              <div className="space-y-1 text-sm">
                <p>
                  <strong>Customer:</strong> {booking.customerName}
                </p>
                <p>
                  <strong>Location:</strong> {booking.location}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(booking.startDate).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(booking.endDate).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <p
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 ${
                  booking.status?.toLowerCase() === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : booking.status?.toLowerCase() === "accepted"
                    ? "bg-green-200 text-green-800"
                    : booking.status?.toLowerCase() === "completed"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {booking.status}
              </p>

              {/* ✅ Accept / Decline for Pending Bookings */}
              {booking.status?.toLowerCase() === "pending" && (
                <div className="flex space-x-3 mt-4 justify-center">
                  <button
                    onClick={() => handleStatusChange(booking._id, "Accepted")}
                    className="px-4 py-2 rounded-md bg-[#B0C4B1] text-[#4A5759] hover:bg-[#4A5759] hover:text-white font-medium transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking._id, "Declined")}
                    className="px-4 py-2 rounded-md bg-[#EDAFB8] text-[#4A5759] hover:bg-[#4A5759] hover:text-white font-medium transition-all"
                  >
                    Decline
                  </button>
                </div>
              )}

              {/* ✅ Mark as Completed for Accepted Bookings */}
              {booking.status?.toLowerCase() === "accepted" && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleStatusChange(booking._id, "Completed")}
                    className="px-4 py-2 rounded-md bg-blue-200 text-blue-800 hover:bg-blue-800 hover:text-white font-medium transition-all"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-[#4A5759] col-span-full text-lg">
            No {statusFilter.toLowerCase()} bookings available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;

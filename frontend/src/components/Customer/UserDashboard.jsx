import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [userStats, setUserStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [sentInvites, setSentInvites] = useState({});
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatsAndEvents = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const res = await axios.get(`${baseUrl}/event/getUserEvents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const eventsData = res.data.events || [];
        const totalSpent = eventsData.reduce(
          (sum, event) => sum + (event.estimatedCost || 0),
          0
        );

        const vendorCount = {};
        eventsData.forEach((event) => {
          event.bookingRequests?.forEach((booking) => {
            if (booking.vendorName) {
              vendorCount[booking.vendorName] =
                (vendorCount[booking.vendorName] || 0) + 1;
            }
          });
        });

        const topVendor =
          Object.entries(vendorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        setUserStats({
          totalEvents: eventsData.length,
          totalSpent,
          topVendor,
        });

        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching user events:", err);
      }
    };

    fetchStatsAndEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (eventId, file) => {
    const formData = new FormData();
    formData.append("guestFile", file);
    formData.append("eventId", eventId);

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(`${baseUrl}/event/uploadGuestList`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert(`Guest list for event ${eventId} uploaded successfully!`);
        setUploadedFiles((prev) => ({ ...prev, [eventId]: true }));
      }
    } catch (err) {
      console.error("Error uploading guest list:", err);
      alert("Failed to upload guest list.");
    }
  };

  const handleSendInvitation = async (eventId) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await axios.post(
        `${baseUrl}/event/sendInvitations`,
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(`Invitations for event ${eventId} sent successfully!`);
        setSentInvites((prev) => ({ ...prev, [eventId]: true }));
      } else {
        alert("Failed to send invitations.");
      }
    } catch (err) {
      console.error("Error sending invitations:", err);
      alert("Error sending invitations.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Declined":
        return "bg-red-200 text-red-800";
      case "Accepted":
        return "bg-green-200 text-green-800";
      case "Completed":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7E1D7] via-[#DEDBD2] to-[#B0C4B1] text-[#4A5759] p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-extrabold mb-2 text-[#4A5759] tracking-wide">
            Plannova – Your Event Planner
          </h1>
          <p className="text-lg text-[#4A5759]">Visualize, Plan & Execute seamlessly.</p>
        </div>
        <button
          onClick={async () => {
            const auth = getAuth();
            await auth.signOut();
            navigate("/");
          }}
          className="bg-[#EDAFB8] text-[#4A5759] px-4 py-2 rounded-xl hover:bg-[#e39ca6] transition shadow-md hover:shadow-xl"
        >
          🚪 Logout
        </button>
      </div>

      {!userStats ? (
        <p className="text-[#4A5759]/70">Loading your stats...</p>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: "🎉 Total Events", value: userStats.totalEvents },
              { label: "💰 Total Spent", value: `₹${userStats.totalSpent}` },
              { label: "🏆 Top Vendor", value: userStats.topVendor },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-[#EDAFB8] text-[#4A5759] p-6 rounded-2xl shadow-xl border border-[#B0C4B1] hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="text-lg font-semibold">{stat.label}</h2>
                <p className="text-4xl font-extrabold mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            onClick={() => navigate("/Customer/add-event")}
            className="bg-[#B0C4B1] text-black px-6 py-3 rounded-lg shadow-md hover:bg-[#9eb2a1] transition-all duration-300 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            ➕ Add New Event
          </motion.button>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search your events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-xl border border-[#4A5759]/30 text-[#4A5759] bg-[#F7E1D7] placeholder-[#4A5759]/50 mb-8 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#EDAFB8]"
          />

          {/* Events */}
          <motion.div
            className="space-y-6 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                className="bg-white text-black rounded-2xl shadow-lg p-6 border-l-4 border-[#EDAFB8] hover:shadow-[#EDAFB8] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold text-[#B0C4B1]">{event.name}</h3>
                <div className="text-sm text-black mt-2 mb-4 space-y-1">
                  <p>📍 <strong>Location:</strong> {event.location}</p>
                  <p>🗓 <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}</p>
                  <p>💸 <strong>Budget:</strong> ₹{event.estimatedCost}</p>
                </div>

                <p className="font-medium text-[#4A5759] mb-1">🛠 Services:</p>
                <ul className="list-disc list-inside text-[#4A5759]/90 text-sm space-y-2">
                  {event.bookingRequests?.map((req) => (
                    <li key={req._id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                          {req.status || "Pending"}
                        </span>
                        <span>
                          {req.serviceName} — <span className="text-[#EDAFB8] font-semibold">{req.vendorName}</span>
                        </span>
                      </div>

                      {req.status === "Accepted" && (
                        <button
                          className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                          onClick={() =>
                            navigate("/Customer/payment", {
                              state: {
                                eventId: event.name,
                                serviceName: req.serviceName,
                                vendorName: req.vendorName,
                                estimatedCost: req.estimatedCost,
                                bookingId: req._id,
                              },
                            })
                          }
                        >
                          💳 Proceed to Payment
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Upload Guest List */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#4A5759] mb-1">
                    📎 Upload Guest List (PDF only)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    disabled={uploadedFiles[event._id]}
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        handleFileUpload(event._id, e.target.files[0]);
                      }
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-[#B0C4B1] file:text-[#4A5759]
                               hover:file:bg-[#9eb2a1] transition"
                  />
                  {uploadedFiles[event._id] && (
                    <button
                      onClick={() => handleSendInvitation(event._id)}
                      className="mt-3 bg-[#EDAFB8] text-[#4A5759] px-4 py-2 rounded-xl hover:bg-[#e39ca6] transition shadow-md"
                    >
                      📧 Send Invitations
                    </button>
                  )}
                  {sentInvites[event._id] && (
                    <div className="mt-2 text-green-700 font-semibold text-sm">
                      ✅ Invitations sent
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;

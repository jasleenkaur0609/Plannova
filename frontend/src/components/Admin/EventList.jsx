import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, MapPin, User, Wallet } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/event/getAllEvents`)
      .then((res) => {
        setEvents(res.data.events); // Assuming response contains events as an array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-[#F7E1D7] min-h-screen">
      <h1 className="text-4xl font-bold text-[#4A5759] mb-10">🎉 All Events</h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading events...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-[#4A5759] mb-2">{event.name}</h2>

              <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B0C4B1]" />
                {event.location || "—"}
              </div>

              <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#EDAFB8]" />
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-800 mb-1">🛠️ Services:</p>
                <div className="flex flex-wrap gap-2">
                  {event.bookingRequests?.map((request, i) => (
                    <span
                      key={i}
                      className="bg-[#B0C4B1] text-white text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {request.serviceName} by {request.vendorName}
                    </span>
                  )) || <span className="text-gray-500">—</span>}
                </div>
              </div>

              <hr className="my-3 border-gray-200" />

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>📋 Description:</strong> {event.description || "—"}
                </p>
                <p className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-[#EDAFB8]" />
                  <strong>Estimated Cost:</strong> ₹{event.estimatedCost || "—"}
                </p>
                <p>
                  <strong>📅 Created At:</strong>{" "}
                  {new Date(event.createdAt).toLocaleString()}
                </p>
                <p className="flex items-center gap-1">
                  <User className="w-4 h-4 text-[#4A5759]" />
                  <strong>Created By:</strong> {event.createdBy || "—"} {/* Customer Name */}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;

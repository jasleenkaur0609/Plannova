import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  MapPin,
  User,
  Wallet,
  ChevronDown,
  ChevronUp,
  Wrench,
} from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedEvent, setExpandedEvent] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/event/getAllEvents`)
      .then((res) => {
        setEvents(res.data.events);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch events.");
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Derive event status based on dates
  const getEventStatus = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return "Upcoming";
    if (now >= startDate && now <= endDate) return "Ongoing";
    if (now > endDate) return "Completed";
    return "Unknown";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-green-100 text-green-700";
      case "ongoing":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#F7E1D7] font-sans">
      <h1 className="text-5xl font-extrabold text-[#4A5759] mb-12 tracking-tight">
        🎉 All Events
      </h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading events...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {events.map((event) => {
            const isExpanded = expandedEvent === event._id;
            const status = getEventStatus(event.startDate, event.endDate);

            return (
              <div
                key={event._id}
                className="relative bg-white rounded-2xl shadow-xl border border-gray-300 p-6 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                onClick={() => toggleExpand(event._id)}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </div>

                {/* Event Title */}
                <h2 className="text-3xl font-semibold text-[#4A5759] mb-3">
                  {event.name}
                </h2>

                {/* Dates */}
                <p className="text-sm text-gray-500 mb-6">
                  <CalendarDays className="inline-block w-5 h-5 mr-1 mb-1 text-[#EDAFB8]" />
                  {formatDate(event.startDate)} — {formatDate(event.endDate)}
                </p>

                {/* Location and Organizer */}
                <div className="flex flex-wrap gap-8 mb-6 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#B0C4B1]" />
                    <span className="font-medium">{event.location || "No Location"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#4A5759]" />
                    <span>{event.createdBy || "Unknown Organizer"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#EDAFB8]" />
                    <span>₹{event.estimatedCost || "N/A"}</span>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-gray-600 mb-6 line-clamp-3">{event.description || "No Description Provided."}</p>

                {/* Expand/Collapse toggle */}
                <div className="flex items-center justify-between text-[#EDAFB8] font-semibold">
                  <span className="select-none">{isExpanded ? "Hide Details" : "View Details"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-6 border-t border-gray-200 pt-5 text-[#4A5759]">
                    <h3 className="flex items-center gap-2 font-semibold text-lg text-[#EDAFB8] mb-4">
                      <Wrench className="w-6 h-6" />
                      Services Booked
                    </h3>

                    {event.bookingRequests && event.bookingRequests.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {event.bookingRequests.map((req, i) => (
                          <li key={i}>
                            <span className="font-semibold">{req.serviceName}</span> by{" "}
                            <span className="italic">{req.vendorName}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="italic text-gray-500">No services booked.</p>
                    )}

                    <p className="mt-6 text-sm text-gray-500">
                      Created at: {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;

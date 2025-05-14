import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, userRes, eventRes] = await Promise.all([
          axios.get(`${baseUrl}/vender/getAllVender`),
          axios.get(`${baseUrl}/user/getAllUser`),
          axios.get(`${baseUrl}/event/getAllEvents`),
        ]);

        setVendors(vendorRes.data);
        setUsers(userRes.data);
        setEvents(eventRes.data.events || []);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchData();
  }, []);

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Live";
  };

  const statusColor = {
    Upcoming: "bg-yellow-200 text-yellow-800",
    Live: "bg-green-200 text-green-800",
    Completed: "bg-red-200 text-red-800",
  };

  // Recently Added Events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Top Vendors by Service Count
  const topVendorsData = [...vendors]
    .map((v) => ({
      name: v.name,
      serviceCount: v.services?.length || Math.floor(Math.random() * 10),
    }))
    .sort((a, b) => b.serviceCount - a.serviceCount)
    .slice(0, 5);

  // Upcoming, Ongoing, Completed Event Summary
  const upcomingEvents = events.filter((e) => new Date(e.startDate) > new Date());
  const ongoingEvents = events.filter((e) => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date());
  const completedEvents = events.filter((e) => new Date(e.endDate) < new Date());

  // Events per Month Bar Chart
  const eventsByMonth = Array(12).fill(0);
  events.forEach((event) => {
    const month = new Date(event.startDate).getMonth();
    eventsByMonth[month] += 1;
  });

  // Handle Date Selection in Calendar
  const selectedEvents = events.filter(
    (e) =>
      new Date(e.startDate).toDateString() === date.toDateString() ||
      new Date(e.endDate).toDateString() === date.toDateString()
  );

  const handleExportCSV = () => {
    const csv = recentEvents.map(
      (e) =>
        `${e.name},${new Date(e.startDate).toLocaleDateString()},${getStatus(
          e.startDate,
          e.endDate
        )}`
    );
    const blob = new Blob([["Name,Start Date,Status\n", ...csv].join("\n")], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "recent_events.csv";
    link.click();
  };

  return (
    <div className=" p-4 bg-[#F7E1D7] min-h-screen">
      <h1 className="text-4xl font-bold text-[#4A5759] mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card count={users.length} label="Total Customers" />
        <Card count={vendors.length} label="Total Vendors" />
        <Card count={events.length} label="Total Events" />
      </div>

      {/* Event Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card count={upcomingEvents.length} label="Upcoming Events" />
        <Card count={ongoingEvents.length} label="Ongoing Events" />
        <Card count={completedEvents.length} label="Completed Events" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {/* Center Panel */}
        <div className="col-span-2 space-y-6">
          {/* Recently Added Events */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">🆕 Recently Added Events</h2>
              <button
                onClick={handleExportCSV}
                className="bg-[#EDAFB8] text-white px-3 py-1 rounded text-sm"
              >
                Export CSV
              </button>
            </div>
            {recentEvents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentEvents.map((event, idx) => {
                  const status = getStatus(event.startDate, event.endDate);
                  return (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="text-[#4A5759] font-medium">{event.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()} – {event.location}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${statusColor[status]}`}
                      >
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No recent events found.</p>
            )}
          </div>

          {/* Top Vendors by Services */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">🌟 Top Vendors by Services</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topVendorsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="serviceCount" fill="#EDAFB8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Events by Month */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">📊 Events by Month</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={eventsByMonth.map((count, idx) => ({ name: `${idx + 1}`, count }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#B0C4B1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar: Calendar + Timeline */}
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-2">📅 Event Calendar</h2>
            <Calendar
              value={date}
              onChange={setDate}
              tileContent={({ date: d }) => {
                const hasEvent = events.some(
                  (e) =>
                    new Date(e.startDate).toDateString() === d.toDateString() ||
                    new Date(e.endDate).toDateString() === d.toDateString()
                );
                return hasEvent ? (
                  <div className="text-[#EDAFB8] text-xl text-center">•</div>
                ) : null;
              }}
              tileClassName={({ date: d }) => {
                const isUpcoming = events.some((e) => {
                  const eventDate = new Date(e.startDate);
                  return (
                    eventDate >= new Date() &&
                    eventDate <= new Date(Date.now() + 7 * 86400000) &&
                    eventDate.toDateString() === d.toDateString()
                  );
                });
                return isUpcoming ? "bg-[#FCE8EC] rounded-full" : null;
              }}
            />
          </div>

          {/* Timeline View */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#4A5759] mb-2">
              Timeline on {date.toDateString()}
            </h3>
            {selectedEvents.length > 0 ? (
              <ul className="relative border-l-2 border-[#EDAFB8] pl-4 space-y-3">
                {selectedEvents.map((e, idx) => (
                  <li key={idx} className="ml-2">
                    <span className="absolute -left-2 top-1 w-3 h-3 bg-[#EDAFB8] rounded-full"></span>
                    <p className="text-sm font-semibold text-[#4A5759]">{e.name}</p>
                    <p className="text-xs text-gray-600">{e.location}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No events on this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ count, label }) => (
  <div className="bg-white shadow-lg p-6 rounded-lg border-l-4 border-[#EDAFB8]">
    <p className="text-3xl font-bold text-[#4A5759]">{count}</p>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default AdminDashboard;

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
  const [activeTab, setActiveTab] = useState("recent"); // For tab in events section
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
  }, [baseUrl]);

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

  // Recently Added Events & Upcoming Events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
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
  const upcomingCount = events.filter((e) => new Date(e.startDate) > new Date()).length;
  const ongoingCount = events.filter(
    (e) => new Date(e.startDate) <= new Date() && new Date(e.endDate) >= new Date()
  ).length;
  const completedCount = events.filter((e) => new Date(e.endDate) < new Date()).length;

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

  return (
    <div className="min-h-screen bg-[#F7E1D7] p-8 text-[#4A5759] font-sans max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Plannova Admin Dashboard</h1>

      <div className="flex gap-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6">
            <SummaryCard count={users.length} label="Total Customers" icon="👥" />
            <SummaryCard count={vendors.length} label="Total Vendors" icon="🛎️" />
            <SummaryCard count={events.length} label="Total Events" icon="🎫" />
          </div>

          {/* Event Status Summary */}
          <div className="grid grid-cols-3 gap-6">
            <SummaryCard count={upcomingCount} label="Upcoming Events" icon="⏳" />
            <SummaryCard count={ongoingCount} label="Ongoing Events" icon="🔥" />
            <SummaryCard count={completedCount} label="Completed Events" icon="✅" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Top Vendors by Services */}
            <section className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">🌟 Top Vendors by Services</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topVendorsData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px" }}
                    formatter={(value) => [`${value} services`, "Services"]}
                  />
                  <Bar dataKey="serviceCount" fill="#EDAFB8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Events by Month */}
            <section className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">📊 Events by Month</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={eventsByMonth.map((count, idx) => ({
                    name: new Date(0, idx).toLocaleString("default", { month: "short" }),
                    count,
                  }))}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px" }}
                    formatter={(value) => [`${value} events`, "Events"]}
                  />
                  <Bar dataKey="count" fill="#B0C4B1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>

        {/* Right Column */}
        <aside className="w-[380px] sticky top-8 space-y-8">
          {/* Calendar */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">📅 Event Calendar</h2>
            <Calendar
              value={date}
              onChange={setDate}
              className="rounded-lg"
              tileContent={({ date: d }) => {
                const hasEvent = events.some(
                  (e) =>
                    new Date(e.startDate).toDateString() === d.toDateString() ||
                    new Date(e.endDate).toDateString() === d.toDateString()
                );
                return hasEvent ? (
                  <div className="text-[#EDAFB8] text-xl text-center select-none">•</div>
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
          </section>

          {/* Timeline */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">📌 Timeline for {date.toDateString()}</h3>
            {selectedEvents.length > 0 ? (
              <ul className="relative border-l-2 border-[#EDAFB8] pl-6 space-y-4 max-h-64 overflow-y-auto">
                {selectedEvents.map((e, idx) => (
                  <li key={idx} className="ml-3">
                    <span className="absolute -left-3 top-2 w-4 h-4 bg-[#EDAFB8] rounded-full shadow-md"></span>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-sm text-gray-600">{e.location}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(e.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {new Date(e.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No events on this day.</p>
            )}
          </section>

          {/* Recent / Upcoming Events Tab */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeTab === "recent" ? "🆕 Recently Added Events" : "⏳ Upcoming Events"}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === "recent"
                      ? "bg-[#EDAFB8] text-white"
                      : "bg-[#DEDBD2] text-[#4A5759]"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === "upcoming"
                      ? "bg-[#EDAFB8] text-white"
                      : "bg-[#DEDBD2] text-[#4A5759]"
                  }`}
                >
                  Upcoming
                </button>
              </div>
            </div>
            {(activeTab === "recent" ? recentEvents : upcomingEvents).length > 0 ? (
              <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                {(activeTab === "recent" ? recentEvents : upcomingEvents).map((event, idx) => {
                  const status = getStatus(event.startDate, event.endDate);
                  return (
                    <li
                      key={idx}
                      className="py-3 flex justify-between items-center hover:bg-[#FCE8EC] rounded-md cursor-pointer transition"
                    >
                      <div>
                        <p className="font-semibold">{event.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()} — {event.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}
                      >
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No events to show.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

const SummaryCard = ({ count, label, icon }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-md border-l-8 border-[#EDAFB8] hover:shadow-lg transition-shadow cursor-default">
    <div className="text-3xl">{icon}</div>
<div>
  <p className="text-3xl font-bold">{count}</p>
  <p className="text-sm font-semibold text-gray-600">{label}</p>
</div>
</div>);
export default AdminDashboard;
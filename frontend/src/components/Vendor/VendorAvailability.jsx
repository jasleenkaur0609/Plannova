import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";

const VendorAvailability = () => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchDates = async () => {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const blockedRes = await fetch(`${baseUrl}/vender/blocked-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blockedData = await blockedRes.json();
      setBlockedDates(blockedData.blockedDates || []);

      const bookedRes = await fetch(`${baseUrl}/vender/booked-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookedData = await bookedRes.json();
      setBookedDates(bookedData.bookedDates || []);
    };

    fetchDates();
  }, []);

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const isBlocked = (date) => blockedDates.includes(formatDate(date));
  const isBooked = (date) => bookedDates.includes(formatDate(date));

  const toggleBlockedDate = (date) => {
    const dateStr = formatDate(date);
    if (isBooked(date)) return;

    if (isBlocked(date)) {
      setBlockedDates((prev) => prev.filter((d) => d !== dateStr));
    } else {
      setBlockedDates((prev) => [...prev, dateStr]);
    }
  };

  const saveBlockedDates = async () => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const res = await fetch(`${baseUrl}/vender/set-blocked-dates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blockedDates }),
      });

      const data = await res.json();
      alert(data.message || "Blocked dates saved successfully!");
    } catch (error) {
      console.error("Error saving blocked dates:", error);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <h1 className="text-3xl font-bold text-center text-[#4A5759]">
        Set Your Availability
      </h1>

      <div className="flex justify-center">
        <Calendar
          onClickDay={toggleBlockedDate}
          tileDisabled={({ date }) => isBooked(date)}
          tileClassName={({ date }) => {
            if (isBooked(date)) return "booked-date";
            if (isBlocked(date)) return "blocked-date";
            return "available-date";
          }}
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={saveBlockedDates}
          className="bg-[#B0C4B1] text-[#4A5759] hover:bg-[#4A5759] hover:text-[#DEDBD2]"
        >
          Save Blocked Dates
        </Button>
      </div>
    </div>
  );
};

export default VendorAvailability;


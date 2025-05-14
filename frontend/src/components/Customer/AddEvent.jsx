import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";
import { logoutUser } from "../../utils/auth";

const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.eventData;

  const [eventName, setEventName] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isOneDay, setIsOneDay] = useState(true);
  const [eventDate, setEventDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefill) {
      setEventName(prefill.name || "");
      setEventPlace(prefill.location || "");
      setEventDescription(prefill.description || "");
      setEstimatedCost(prefill.estimatedCost?.toString() || "");

      if (prefill.startDate === prefill.endDate) {
        setIsOneDay(true);
        setEventDate(prefill.startDate || "");
      } else {
        setIsOneDay(false);
        setStartDate(prefill.startDate || "");
        setEndDate(prefill.endDate || "");
      }
    }
  }, [prefill]);

  const isFormValid = () => {
    if (!eventName || !eventPlace || !eventDescription || !estimatedCost) return false;
    if (isOneDay) return !!eventDate;
    return !!startDate && !!endDate && startDate <= endDate;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("Please complete all fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      const token = await user.getIdToken();

      const eventPayload = {
        name: eventName,
        location: eventPlace,
        description: eventDescription,
        estimatedCost: Number(estimatedCost),
        startDate: isOneDay ? eventDate : startDate,
        endDate: isOneDay ? eventDate : endDate,
      };

      navigate("/customer/select-services", { state: { eventData: eventPayload } });
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to proceed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7E1D7] via-[#DEDBD2] to-[#B0C4B1] text-[#4A5759] p-6 font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-1 text-[#4A5759] tracking-wide">
            Plannova – Your Event Planner
          </h1>
          <p className="text-base md:text-lg text-[#4A5759]/80">
            Visualize, Plan & Execute seamlessly.
          </p>
        </div>
        <button
          onClick={()=>{logoutUser(navigate)}}
          className="bg-[#EDAFB8] text-black px-4 py-2 rounded-xl hover:bg-[#e39ca6] transition shadow-md hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="flex justify-center">
        <motion.div
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-[#4A5759]">Create a New Event</h2>

          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="w-full mb-4 p-3 rounded-lg bg-white border border-gray-300"
          />

          <input
            type="text"
            value={eventPlace}
            onChange={(e) => setEventPlace(e.target.value)}
            placeholder="Event Location"
            className="w-full mb-4 p-3 rounded-lg bg-white border border-gray-300"
          />

          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Event Details"
            rows={4}
            className="w-full mb-4 p-3 rounded-lg bg-white border border-gray-300 resize-none"
          />

          <input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Estimated Cost (₹)"
            className="w-full mb-4 p-3 rounded-lg bg-white border border-gray-300"
          />

          <label className="flex items-center mb-3 text-[#4A5759] font-semibold">
            <input
              type="checkbox"
              checked={isOneDay}
              onChange={() => {
                setIsOneDay(!isOneDay);
                setEventDate("");
                setStartDate("");
                setEndDate("");
                setDateError("");
              }}
              className="mr-2"
            />
            One-day event
          </label>

          {isOneDay ? (
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-white border border-gray-300"
            />
          ) : (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) setDateError("Start date must be before end date");
                  else setDateError("");
                }}
                className="w-full mb-2 p-3 rounded-lg bg-white border border-gray-300"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (startDate && e.target.value < startDate) setDateError("End date must be after start date");
                  else setDateError("");
                }}
                className="w-full mb-2 p-3 rounded-lg bg-white border border-gray-300"
              />
              {dateError && (
                <div className="flex items-center text-red-600 text-sm mt-1">
                  <AiOutlineWarning className="mr-1" />
                  {dateError}
                </div>
              )}
            </>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            className="bg-[#EDAFB8] text-black px-6 py-3 mt-6 rounded-lg w-full font-semibold shadow-md hover:bg-[#e49aa8] transition-all duration-300"
          >
            {loading ? "Loading..." : "Select Services"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEvent;

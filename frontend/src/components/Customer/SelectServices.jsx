import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SelectServices = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const eventData = location?.state?.eventData;
  const previouslySelected = location?.state?.selectedServices || [];

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(previouslySelected);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!eventData) {
      alert("Event data missing. Redirecting to event creation form.");
      navigate("/customer/add-event");
    }
  }, [eventData, navigate]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/admin/getAllServices`)
      .then((res) => setServices(res.data.services))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleSelectService = (service) => {
    if (!selectedServices.find((s) => s._id === service._id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s._id !== serviceId));
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNextStep = () => {
    navigate("/customer/event-preview", {
      state: {
        eventData,
        selectedServices,
      },
    });
  };

  const totalCost = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const budget = eventData?.estimatedCost || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7E1D7] via-[#DEDBD2] to-[#B0C4B1] p-8 font-sans text-[#4A5759]">
      {/* Top Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold mb-2">Select Services</h2>
        <p className="text-lg text-[#4A5759]/80">
          Choose the services you'd like for your event.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border-l-4 border-[#EDAFB8]">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <p className="text-sm">
          <span className="font-medium">Total Budget:</span> ₹{budget}
        </p>
        <p className="text-sm">
          <span className="font-medium">Selected Services:</span> {selectedServices.length}
        </p>
        <p
          className={`text-sm ${
            totalCost > budget ? "text-red-600 font-bold" : "text-gray-700"
          }`}
        >
          <span className="font-medium">Total Cost:</span> ₹{totalCost}
          {totalCost > budget && <span className="ml-2">⚠️ Over Budget</span>}
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-xl shadow-sm"
      />

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pb-4">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between"
          >
            <div className="text-left mb-3">
              <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{service.description}</p>
              <p className="text-sm text-gray-700 font-medium">₹{service.price}</p>
            </div>
            <button
              onClick={() => handleSelectService(service)}
              className="bg-[#EDAFB8] hover:bg-[#e39ca6] text-[#4A5759] px-4 py-2 rounded-lg transition shadow"
            >
              ➕ Add
            </button>
          </div>
        ))}
      </div>

      {/* Selected Services List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Selected Services:</h3>
        {selectedServices.length === 0 ? (
          <p className="text-sm text-gray-500">No services selected yet.</p>
        ) : (
          <ul className="space-y-2">
            {selectedServices.map((service) => (
              <li
                key={service._id}
                className="bg-white p-3 rounded-lg shadow flex justify-between items-center"
              >
                <span>
                  {service.name} (₹{service.price})
                </span>
                <button
                  className="text-red-600 text-sm font-medium"
                  onClick={() => handleRemoveService(service._id)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() =>
            navigate("/Customer/add-event", {
              state: {
                eventData,
                selectedServices,
              },
            })
          }
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg w-full font-semibold shadow"
        >
          🔙 Edit Event Details
        </button>

        <button
          onClick={handleNextStep}
          disabled={selectedServices.length === 0}
          className={`px-6 py-3 rounded-lg w-full font-semibold shadow ${
            selectedServices.length === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#EDAFB8] hover:bg-[#e39ca6] text-[#4A5759]"
          }`}
        >
          Proceed to Event Preview
        </button>
      </div>
    </div>
  );
};

export default SelectServices;

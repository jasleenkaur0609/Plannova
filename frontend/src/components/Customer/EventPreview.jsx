import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from "firebase/auth";

const EventPreview = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location?.state?.eventData;
  const selectedServices = location?.state?.selectedServices || [];
  const [isLoading, setIsLoading] = useState(false);

  console.log("Event Data:", eventData);
  console.log("Selected Services:", selectedServices);

  const totalCost = selectedServices.reduce(
    (sum, service) => sum + Number(service.price || 0),
    0
  );

  const handleCreateEvent = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        navigate('/login'); // Redirect to login page
        return;
      }

      const token = await user.getIdToken();

      const eventPayload = {
        ...eventData,
        services: selectedServices.map(service => service._id),
        totalCost,
      };

      const response = await axios.post(`${baseUrl}/event/createEvent`, eventPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate('/customer/dashboard');
      } else {
        alert(`Failed to create event. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create the event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSelectServices = () => {
    navigate('/customer/select-services', {
      state: { eventData, selectedServices },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7E1D7] p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-[#4A5759] mb-6 text-center">🎉 Event Preview</h2>

        {/* Event Details */}
        <div className="grid gap-4 md:grid-cols-2 text-[#4A5759] text-md font-medium mb-6">
          <p><strong>Event Name:</strong> {eventData?.name}</p>
          <p><strong>Dates:</strong> {eventData?.startDate} to {eventData?.endDate}</p>
          <p><strong>Location:</strong> {eventData?.location}</p>
          <p><strong>Description:</strong> {eventData?.description}</p>
          <p><strong>Estimated Budget:</strong> ₹{Number(eventData?.estimatedCost || 0).toLocaleString("en-IN")}</p>
        </div>

        {/* Services List */}
        <div className="bg-[#FDF2F2] rounded-lg p-5 mb-6 shadow-inner">
          <h3 className="text-xl font-semibold text-[#4A5759] mb-3">🧰 Selected Services</h3>
          {selectedServices.length === 0 ? (
            <p className="text-gray-500">No services selected.</p>
          ) : (
            <ul className="space-y-2">
              {selectedServices.map((service) => (
                <li key={service._id} className="flex justify-between border-b border-gray-200 py-2">
                  <span>{service.name}</span>
                  <span>₹{Number(service.price).toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-lg font-bold text-[#4A5759]">
            Total Cost: ₹{totalCost.toLocaleString("en-IN")}
          </div>
          {Number(eventData?.estimatedCost || 0) < totalCost && (
            <p className="text-red-600 text-sm mt-1 font-semibold">⚠️ Total cost exceeds estimated budget!</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={handleBackToSelectServices}
            className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-semibold transition"
          >
            ⬅ Back to Services
          </button>

          <button
            onClick={handleCreateEvent}
            disabled={isLoading}
            className={`bg-[#EDAFB8] hover:bg-[#e597a8] text-black px-6 py-3 rounded-lg font-semibold transition ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? 'Creating...' : '✅ Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;

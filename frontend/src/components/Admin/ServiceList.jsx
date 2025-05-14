import React, { useEffect, useState } from "react";
import axios from "axios";

const ServiceList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${baseUrl}/admin/getAllServices`);
        const formatted = res.data.services.map((service) => ({
          id: service._id,
          name: service.name || "Unnamed Service",
          image: service.image || "https://via.placeholder.com/300",
          price: service.price || "N/A",
          description: service.description || "No description provided.",
          vendorName: service.vendor || "Unknown Vendor",
          createdAt: service.createdAt,
        }));
        setServices(formatted);
        setFilteredServices(formatted);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, services]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  return (
    <div className="p-4 bg-[#F7E1D7] min-h-screen">
      <div className="flex-1 p-10 bg-[#F7E1D7] min-h-screen">
        {/* <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#4A5759] mb-2">Explore Vendor Services</h1>
          <p className="text-[#4A5759] text-lg">Find all available services offered by registered vendors.</p>
        </div> */}

        <input
          type="text"
          placeholder="Search by service name or vendor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 px-4 py-2 rounded-full border border-[#DEDBD2] w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#EDAFB8]"
        />

        {loading ? (
          <p className="text-[#4A5759] text-center">Loading services...</p>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentItems.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg border border-[#DEDBD2] overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={`${baseUrl}/uploads/services/${service.image}`}
                  alt={service.name}
                  /*onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}*/
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-[#4A5759] mb-1">{service.name}</h2>
                  <p className="text-[#EDAFB8] font-bold text-lg mb-1">
                    ₹{isNaN(Number(service.price)) ? "N/A" : Number(service.price).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-[#4A5759] mb-2">{service.description}</p>
                  <p className="text-sm text-[#4A5759]">
                    <span className="font-semibold">Vendor:</span> {service.vendorName}
                  </p>
                  <p className="text-xs text-[#4A5759] mt-1">
                    <span className="font-semibold">Added:</span> {formatDate(service.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#4A5759] mt-10">No services found.</p>
        )}

        {filteredServices.length > itemsPerPage && (
          <div className="flex justify-center mt-12 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#B0C4B1] text-white rounded-full disabled:opacity-50"
            >
              ⬅️ Prev
            </button>
            <span className="self-center text-[#4A5759]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#B0C4B1] text-white rounded-full disabled:opacity-50"
            >
              Next ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const ServiceList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalService, setModalService] = useState(null); // For modal open service
  const itemsPerPage = 6;

  // Fetch services
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
  }, [baseUrl]);

  // Filter services based on searchTerm
  useEffect(() => {
    const filtered = services.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Format date string
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Close modal on ESC key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setModalService(null);
      }
    },
    [setModalService]
  );

  useEffect(() => {
    if (modalService) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll when modal open
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalService, handleKeyDown]);

  return (
    <div className="min-h-screen bg-[#F7E1D7] p-6 sm:p-10 relative">
      {/* Header & Search */}
      <header className="sticky top-0 bg-[#F7E1D7] z-20 py-4 mb-6">
        <h1 className="text-4xl font-extrabold text-[#4A5759] mb-2 tracking-tight">
          Vendor Services
        </h1>
        <p className="text-[#4A5759] max-w-xl">
          Discover a curated list of services offered by trusted vendors.
        </p>
        <input
          type="search"
          placeholder="Search services or vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 w-full max-w-md px-5 py-3 rounded-full border border-[#DEDBD2] 
            focus:outline-none focus:ring-4 focus:ring-[#EDAFB8] transition"
          aria-label="Search services or vendors"
        />
      </header>

      {/* Loading & Empty State */}
      {loading ? (
        <p className="text-[#4A5759] text-center mt-20">Loading services...</p>
      ) : currentItems.length > 0 ? (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((service) => (
            <article
              key={service.id}
              className="group relative flex flex-col bg-white rounded-3xl shadow-xl 
              border border-[#DEDBD2] overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={`${baseUrl}/uploads/services/${service.image}`}
                  alt={service.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
                <div
                  className="absolute top-3 right-3 bg-[#EDAFB8] bg-opacity-90 px-3 py-1 rounded-full text-white
                  font-semibold text-sm tracking-wide shadow-lg"
                >
                  ₹
                  {isNaN(Number(service.price))
                    ? "N/A"
                    : Number(service.price).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="flex flex-col flex-grow p-6">
                <h2 className="text-[#4A5759] font-bold text-xl mb-1 truncate">
                  {service.name}
                </h2>
                <p className="text-[#7C8A7E] flex-grow text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-[#4A5759] text-sm font-medium">
                  <span>
                    Vendor:{" "}
                    <span className="font-semibold">{service.vendorName}</span>
                  </span>
                  <time dateTime={service.createdAt} className="italic">
                    {formatDate(service.createdAt)}
                  </time>
                </div>

                <button
                  onClick={() => setModalService(service)}
                  className="mt-6 w-full py-3 bg-[#EDAFB8] text-white font-semibold rounded-xl 
                    hover:bg-[#d69cae] transition-colors shadow-md active:scale-95"
                  aria-label={`View details for ${service.name}`}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </main>
      ) : (
        <p className="text-center text-[#4A5759] mt-24 text-lg font-medium">
          No services found.
        </p>
      )}

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center mt-12 space-x-4"
        >
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              aria-current={currentPage === idx + 1 ? "page" : undefined}
              className={`w-4 h-4 rounded-full transition-colors ${
                currentPage === idx + 1
                  ? "bg-[#EDAFB8] shadow-lg"
                  : "bg-[#DEDBD2] hover:bg-[#B0C4B1]"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </nav>
      )}

      {/* Modal */}
      {modalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={() => setModalService(null)} // Close modal on outside click
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 sm:mx-0 p-8 relative
              transform transition-all duration-300 ease-in-out
              scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
          >
            <button
              onClick={() => setModalService(null)}
              className="absolute top-5 right-5 text-[#4A5759] hover:text-[#EDAFB8] transition"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
stroke="currentColor"
strokeWidth={2}
>
<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
</button>
        <h3
          id="modal-title"
          className="text-3xl font-extrabold text-[#4A5759] mb-4"
        >
          {modalService.name}
        </h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={`${baseUrl}/uploads/services/${modalService.image}`}
            alt={modalService.name}
            className="w-full sm:w-72 h-48 object-cover rounded-xl flex-shrink-0"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300";
            }}
          />
          <div className="flex flex-col justify-between text-[#4A5759]">
            <p
              id="modal-description"
              className="mb-4 text-lg leading-relaxed whitespace-pre-line"
            >
              {modalService.description}
            </p>
            <p className="font-semibold text-xl text-[#EDAFB8] mb-2">
              Price: ₹
              {isNaN(Number(modalService.price))
                ? "N/A"
                : Number(modalService.price).toLocaleString("en-IN")}
            </p>
            <p className="mb-1">
              <strong>Vendor:</strong> {modalService.vendorName}
            </p>
            <p className="italic text-sm text-gray-500">
              Added on {formatDate(modalService.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
};

export default ServiceList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchServices = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch(`${baseUrl}/service/getServices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This service will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        const res = await fetch(`${baseUrl}/service/deleteService/${serviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          Swal.fire("Deleted!", "The service has been deleted.", "success");
          setServices((prev) => prev.filter((s) => s._id !== serviceId));
        } else {
          Swal.fire("Error", "Failed to delete service", "error");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
  };

  const handleCloseModal = () => {
    setEditingService(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { _id, description, price, newImage } = editingService;

    if (!description || !price) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append("description", description);
      formData.append("price", price);
      if (newImage) formData.append("ServiceImage", newImage);

      const res = await fetch(`${baseUrl}/service/editService/${_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        Swal.fire("Updated!", "The service has been updated.", "success");
        fetchServices();
        setEditingService(null);
      } else {
        Swal.fire("Error", "Failed to update service", "error");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#B0C4B1] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#4A5759]">Your Services</h1>
        <button
          onClick={() => navigate("/vendor/add-service")}
          className="flex items-center gap-2 bg-[#4A5759] text-[#F7E1D7] hover:bg-[#3b4748] px-4 py-2 rounded-xl transition duration-200"
        >
          <PlusCircle className="w-5 h-5" /> Add New Service
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-center text-[#4A5759] text-lg mt-20">
          You haven't added any services yet.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-[#F7E1D7] border border-[#DEDBD2] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              {service.image && (
                <img
                  src={`${baseUrl}/uploads/services/${service.image}`}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-[#4A5759]">{service.name}</h3>
                <p className="text-sm text-[#4A5759]">{service.description}</p>
                <p className="text-[#EDAFB8] font-semibold text-lg">₹ {service.price}</p>
                <div className="flex gap-3 mt-4 justify-center">
                  <button
                    onClick={() => handleEditService(service)}
                    className="flex items-center gap-1 px-4 py-2 bg-[#B0C4B1] text-[#4A5759] rounded-lg hover:bg-[#4A5759] hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-[#EDAFB8] text-[#4A5759] rounded-lg hover:bg-[#4A5759] hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2">
            <h3 className="text-2xl font-bold text-[#4A5759] mb-4">Edit Service</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-[#4A5759]">Service Name (Not Editable)</label>
                <input
                  type="text"
                  value={editingService.name}
                  disabled
                  className="w-full px-4 py-2 border border-[#B0C4B1] rounded-md bg-gray-100 text-gray-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#4A5759]">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#B0C4B1] rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#4A5759]">Price (₹)</label>
                <input
                  type="number"
                  value={editingService.price}
                  onChange={(e) =>
                    setEditingService({ ...editingService, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#B0C4B1] rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#4A5759]">Change Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingService({ ...editingService, newImage: e.target.files[0] })
                  }
                  className="w-full px-4 py-2 border border-[#B0C4B1] rounded-md bg-white"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-[#EDAFB8] text-[#4A5759] rounded-lg hover:bg-[#4A5759] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4A5759] text-[#F7E1D7] rounded-lg hover:bg-[#3b4748] hover:text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServices;
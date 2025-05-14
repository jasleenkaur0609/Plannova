import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const AddService = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (image) formData.append("ServiceImage", image);

      const res = await fetch(`${baseUrl}/service/addService`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to add service:", errorData.message);
        return;
      }

      navigate("/vendor/services");
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Pane */}
      <div className="hidden md:flex items-center justify-center bg-[#B0C4B1] p-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#4A5759]">Create Your Magic ✨</h1>
          <p className="text-[#4A5759] text-lg">
            Add a new service and expand your offerings. Let the world know what you do best.
          </p>
          <div className="w-24 h-1 mx-auto bg-[#EDAFB8] rounded-full"></div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex items-center justify-center bg-[#F7E1D7] px-6 py-12">
        <div className="w-full max-w-md bg-[#DEDBD2] p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center text-[#4A5759] mb-6">Add New Service</h2>
          <form onSubmit={handleAddService} className="space-y-5">
            <div>
              <label className="block text-[#4A5759] font-medium">Service Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Wedding Photography"
                className="w-full rounded-xl bg-white text-[#4A5759] placeholder:text-[#4A5759]/50 px-4 py-2 border border-[#DEDBD2] focus:outline-none focus:ring-2 focus:ring-[#B0C4B1]"
                required
              />
            </div>
            <div>
              <label className="block text-[#4A5759] font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell more about your service..."
                className="w-full rounded-xl bg-white text-[#4A5759] placeholder:text-[#4A5759]/50 px-4 py-2 border border-[#DEDBD2] focus:outline-none focus:ring-2 focus:ring-[#B0C4B1] resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-[#4A5759] font-medium">Price (INR)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 4999"
                className="w-full rounded-xl bg-white text-[#4A5759] placeholder:text-[#4A5759]/50 px-4 py-2 border border-[#DEDBD2] focus:outline-none focus:ring-2 focus:ring-[#B0C4B1]"
                required
              />
            </div>
            <div>
              <label className="block text-[#4A5759] font-medium">Service Image</label>
              <input
                type="file"
                name="ServiceImage"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full bg-white text-[#4A5759] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EDAFB8] file:text-[#4A5759] hover:file:bg-[#e29fa9]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4A5759] text-[#F7E1D7] hover:bg-[#3b4748] font-semibold py-2 rounded-xl transition"
            >
              Save Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;


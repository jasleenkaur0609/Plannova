import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not logged in");

        const idToken = await currentUser.getIdToken();

        const res = await fetch(`${baseUrl}/vender/getVender`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch vendor profile");

        const data = await res.json();
        setVendor(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-[#4A5759] text-lg">Loading...</p>;

  if (!vendor)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Failed to load profile.
      </p>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#F7E1D7] via-[#DEDBD2] to-[#B0C4B1] py-20 px-6 max-h-screen min-w-screen overflow-auto">
      
      <div className="absolute top-10 -left-10 w-60 h-60 bg-[#EDAFB8] rounded-full opacity-20 blur-3xl z-0"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-[#B0C4B1] rounded-full opacity-20 blur-2xl z-0"></div>

      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {vendor.profilePic && (
          <img
            src={`${baseUrl}/uploads/profiles/${vendor.profilePic}`}
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-[#EDAFB8] shadow-lg mb-6 hover:scale-105 transition"
          />
        )}

        <h1 className="text-4xl font-bold text-[#4A5759] mb-2">
          {vendor.name}
        </h1>
        <p className="text-[#4A5759] text-lg mb-8">
          Vendor since{" "}
          <span className="italic font-semibold">
            {new Date(vendor.createdAt).toLocaleDateString()}
          </span>
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 text-left bg-white bg-opacity-60 backdrop-blur-md p-10 rounded-2xl shadow-lg">
          <div>
            <label className="text-sm text-[#B0C4B1] uppercase tracking-wide font-medium">
              Email
            </label>
            <p className="text-lg text-[#4A5759] font-semibold">
              {vendor.email}
            </p>
          </div>

          <div>
            <label className="text-sm text-[#B0C4B1] uppercase tracking-wide font-medium">
              Phone
            </label>
            <p className="text-lg text-[#4A5759] font-semibold">
              {vendor.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;

/*import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not logged in");

        const idToken = await currentUser.getIdToken();

        const res = await fetch(`${baseUrl}/vender/getVender`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch vendor profile");

        const data = await res.json();
        setVendor(data);
        setEmail(data.email);
        setPhone(data.phone);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
  
      const res = await fetch(`${baseUrl}/vender/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, phone }),
      });
  
      if (!res.ok) throw new Error("Failed to update profile");
  
      const updated = await res.json();
      setVendor(prev => ({ ...prev, email, phone }));
      setEditMode(false);
  
      // ✅ SweetAlert2 success
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        background: "#F7E1D7",
        confirmButtonColor: "#4A5759",
      });
  
    } catch (err) {
      console.error("Update error:", err);
  
      // ❌ SweetAlert2 error
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating your profile.",
        background: "#F7E1D7",
        confirmButtonColor: "#4A5759",
      });
  
    } finally {
      setSaving(false);
    }
  };  

  if (loading)
    return <p className="text-center mt-10 text-[#4A5759] text-lg">Loading...</p>;

  if (!vendor)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Failed to load profile.
      </p>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#F7E1D7] via-[#DEDBD2] to-[#B0C4B1] py-20 px-6">
      
      <div className="absolute top-10 -left-10 w-60 h-60 bg-[#EDAFB8] rounded-full opacity-20 blur-3xl z-0"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-[#B0C4B1] rounded-full opacity-20 blur-2xl z-0"></div>

      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {vendor.profilePic && (
          <img
            src={`${baseUrl}/uploads/profiles/${vendor.profilePic}`}
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-[#EDAFB8] shadow-lg mb-6 hover:scale-105 transition"
          />
        )}

        <h1 className="text-4xl font-bold text-[#4A5759] mb-2">
          {vendor.name}
        </h1>
        <p className="text-[#4A5759] text-lg mb-8">
          Vendor since{" "}
          <span className="italic font-semibold">
            {new Date(vendor.createdAt).toLocaleDateString()}
          </span>
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 text-left bg-white bg-opacity-60 backdrop-blur-md p-10 rounded-2xl shadow-lg">
          <div>
            <label className="text-sm text-[#B0C4B1] uppercase tracking-wide font-medium">
              Email
            </label>
            {editMode ? (
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 border border-[#B0C4B1] rounded-md text-[#4A5759]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <p className="text-lg text-[#4A5759] font-semibold">
                {vendor.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-[#B0C4B1] uppercase tracking-wide font-medium">
              Phone
            </label>
            {editMode ? (
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border border-[#B0C4B1] rounded-md text-[#4A5759]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            ) : (
              <p className="text-lg text-[#4A5759] font-semibold">
                {vendor.phone}
              </p>
            )}
          </div>
        </div>

        
        <div className="mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#4A5759] text-white px-6 py-2 rounded-xl hover:bg-[#374041] transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-[#EDAFB8] text-white px-6 py-2 rounded-xl hover:bg-[#e59ba7] transition disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;*/
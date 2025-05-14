import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";

export default function RegisterForm() {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormState({ ...formState, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password
      );
      const firebaseUser = userCredential.user;
  
      let endpoint = `${baseUrl}/user/createUser`;
      //if (formState.role === "admin") endpoint = `${baseUrl}/admin/createAdmin`;
      if (formState.role === "vendor") endpoint = `${baseUrl}/vender/createVender`;
  
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("uid", firebaseUser.uid);
      if (profilePic) formData.append("profilePic", profilePic);
  
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: `Welcome aboard, ${formState.role}`,
          confirmButtonColor: "#4A5759",
        });
  
        if (formState.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          window.location.href = `${baseUrl}/api/auth/google?uid=${firebaseUser.uid}&role=${formState.role}`;
        }
      } else {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonColor: "#EDAFB8",
      });
    }
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #F7E1D7, #B0C4B1, #EDAFB8)",
      }}
    >
      <div
        className="w-full max-w-4xl p-10 rounded-2xl shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#4A5759]">Register</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-[#4A5759] font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-[#4A5759] placeholder:text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#4A5759] font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-[#4A5759] placeholder:text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#4A5759] font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-[#4A5759] placeholder:text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[#4A5759] font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-[#4A5759] placeholder:text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-[#4A5759] font-medium mb-1">
              Select Role
            </label>
            <select
              id="role"
              value={formState.role}
              onChange={handleRoleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            >
              <option value="customer">Customer</option>
              {/*<option value="admin">Admin</option>*/}
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label htmlFor="profilePic" className="block text-[#4A5759] font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full bg-white/30 text-[#4A5759] font-medium rounded-lg py-2 px-4"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#4A5759] text-[#DEDBD2] hover:bg-[#3b4748] hover:text-white font-semibold rounded-xl py-2 transition"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-6 text-[#4A5759]">
          Already have an account?{" "}
          <a href="/login" className="text-[#EDAFB8] font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";
import Swal from "sweetalert2";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const user = await loginUser(formState.email, formState.password);
      const token = await user.getIdToken();
  
      const response = await fetch(`${baseUrl}/vender/getRole`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userRole", data.role);
  
        await Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${data.role}`,
          confirmButtonColor: "#4A5759",
        });
  
        if (data.role === "vendor") navigate("/vendor/dashboard");
        else if (data.role === "admin") navigate("/admin/dashboard");
        else navigate("/customer/dashboard");
      } else {
        throw new Error(data.message || "Failed to fetch user role");
      }
    } catch (error) {
      setErrorMessage(error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
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
        className="w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#4A5759]">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[#4A5759] font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 placeholder:text-[#4A5759] text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[#4A5759] font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 placeholder:text-[#4A5759] text-[#4A5759] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A5759]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#4A5759] text-[#DEDBD2] hover:bg-[#3b4748] hover:text-white font-semibold rounded-xl py-2 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-[#4A5759]">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#EDAFB8] font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

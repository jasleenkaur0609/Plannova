import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Dummy Payment Successful via Stripe (Visa Only)");
    navigate("/Customer/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Stripe Payment
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your Visa card details to complete the payment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Name on Card</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="4242 4242 4242 4242"
            />
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="text-sm text-gray-600">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="MM/YY"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-600">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold mt-4 transition"
          >
            Pay ₹6000.00
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
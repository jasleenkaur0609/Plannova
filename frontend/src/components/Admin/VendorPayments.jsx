import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const VendorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, payment: null });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, tab, search, startDate, endDate, sortField, sortOrder]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/payments/pending`);
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const filterPayments = () => {
    let list = [...payments];

    if (tab) {
      list = list.filter((p) => p.status.toLowerCase() === tab);
    }

    if (search) {
      const term = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.eventName?.toLowerCase().includes(term) ||
          p.user?.toLowerCase().includes(term) ||
          p.service?.toLowerCase().includes(term)
      );
    }

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      list = list.filter((p) => {
        const d = new Date(p.eventDate);
        return d >= s && d <= e;
      });
    }

    if (sortField) {
      list.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === "eventDate") {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
    }

    setFiltered(list);
    setCurrentPage(1);
  };

  const confirmPayment = (payment) => {
    setConfirmModal({ open: true, payment });
  };

  const handleBackendPayment = async () => {
    const { payment } = confirmModal;

    try {
      const res = await axios.post("http://localhost:8000/payments/process", {
        amount: payment.amount,
        vendorId: payment.vendorId,
        paymentId: payment._id,
      });

      if (res.data.success) {
        alert("Payment processed successfully!");
        setConfirmModal({ open: false, payment: null });
        fetchPayments();
      } else {
        alert(res.data.message || "Payment failed.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("An error occurred while processing the payment.");
    }
  };

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#F7E1D7] text-[#4A5759]">
      {/* Sidebar assumed to be included externally */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Vendor Payments</h2>
          <a
            href="/admin/dashboard"
            className="text-sm bg-[#EDAFB8] text-white px-4 py-2 rounded hover:bg-[#e597a6] transition"
          >
            Back to Dashboard
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["pending", "paid"].map((status) => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`px-4 py-2 rounded-full ${
                tab === status
                  ? status === "pending"
                    ? "bg-[#EDAFB8] text-white"
                    : "bg-[#B0C4B1] text-white"
                  : "bg-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="p-2 border rounded w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="eventDate">Event Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            className="p-2 border rounded"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-[#B0C4B1] text-white">
              <tr>
                <th className="p-3">Event</th>
                <th className="p-3">Service</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Event Date</th>
                <th className="p-3">Status</th>
                {tab === "pending" && <th className="p-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length ? (
                paginatedData.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-[#fdf1ec]">
                    <td className="p-3">{p.eventName}</td>
                    <td className="p-3">{p.service}</td>
                    <td className="p-3">{p.user}</td>
                    <td className="p-3">₹{p.amount}</td>
                    <td className="p-3">{dayjs(p.eventDate).format("DD MMM YYYY")}</td>
                    <td className="p-3 capitalize">{p.status}</td>
                    {tab === "pending" && (
                      <td className="p-3">
                        <button
                          onClick={() => confirmPayment(p)}
                          className="bg-[#EDAFB8] px-3 py-1 rounded text-white"
                        >
                          Pay Now
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <span>
            Page {currentPage} of {Math.ceil(filtered.length / itemsPerPage)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white border px-3 py-1 rounded"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  p < Math.ceil(filtered.length / itemsPerPage) ? p + 1 : p
                )
              }
              disabled={currentPage >= Math.ceil(filtered.length / itemsPerPage)}
              className="bg-white border px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        </div>

        {/* Confirm Modal */}
        {confirmModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
              <p className="text-sm mb-4">
                Are you sure you want to pay{" "}
                <span className="font-semibold text-[#EDAFB8]">
                  ₹{confirmModal.payment.amount}
                </span>{" "}
                to <strong>{confirmModal.payment.user}</strong> for the{" "}
                <strong>{confirmModal.payment.service}</strong> service?
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal({ open: false, payment: null })}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBackendPayment}
                  className="px-4 py-2 rounded bg-[#EDAFB8] text-white hover:bg-[#e597a6]"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorPayments;

import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/getAllUser`);
        const extractedUsers = res.data.map((u) => u.data);
        setUsers(extractedUsers);
        setFilteredUsers(extractedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Unable to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  // Filter users by search term
  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aKey = a[sortConfig.key].toLowerCase();
        const bKey = b[sortConfig.key].toLowerCase();
        if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, users, sortConfig]);

  // Calculate current page users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Handle sort button click
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      // Toggle direction
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  // Render sort arrow icons
  const SortArrow = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <span className="ml-1 text-[#4A5759] text-sm select-none">&#9650;</span> // Up arrow ▲
    ) : (
      <span className="ml-1 text-[#4A5759] text-sm select-none">&#9660;</span> // Down arrow ▼
    );
  };

  return (
    <div className="p-8 bg-[#F7E1D7] min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-[#4A5759] mb-8 border-b border-[#B0C4B1] pb-3 w-full max-w-5xl">
        User Directory
      </h1>

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-5xl mb-6 px-4 py-3 rounded-md border border-[#B0C4B1] focus:outline-none focus:ring-2 focus:ring-[#EDAFB8] placeholder-[#4A5759]/60 transition"
      />

      {loading ? (
        <p className="text-[#4A5759] text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-[#4A5759] text-lg">No users found.</p>
      ) : (
        <>
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-[#B0C4B1] text-[#4A5759] uppercase text-sm tracking-wide select-none">
                <tr>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center select-none">
                      Name
                      <SortArrow columnKey="name" />
                    </div>
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center select-none">
                      Email
                      <SortArrow columnKey="email" />
                    </div>
                  </th>
                  <th className="p-4 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    className={`border-b last:border-none cursor-default transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-[#F9F7F4]" : "bg-white"
                    } hover:bg-[#EDAFB8]/30`}
                    title={`Contact: ${user.email}`}
                  >
                    <td className="p-4 font-medium text-[#4A5759]">{user.name}</td>
                    <td className="p-4 text-[#4A5759]/90">{user.email}</td>
                    <td className="p-4 text-[#4A5759]/80">{user.phone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="flex justify-center items-center mt-6 space-x-2 select-none"
            aria-label="User list pagination"
          >
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border border-[#B0C4B1] text-[#4A5759] hover:bg-[#EDAFB8] disabled:opacity-40 disabled:cursor-not-allowed transition`}
            >
              Prev
            </button>

            {/* Show page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                totalPages <= 5 ||
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 rounded-md border ${
                      page === currentPage
                        ? "bg-[#EDAFB8] text-[#4A5759]"
                        : "border-[#B0C4B1] text-[#4A5759] hover:bg-[#DEDBD2]"
                    } transition`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-[#4A5759]">
                    ...
                  </span>
                );
              } else {
                return null;
              }
            })}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border border-[#B0C4B1] text-[#4A5759] hover:bg-[#EDAFB8] disabled:opacity-40 disabled:cursor-not-allowed transition`}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
};

export default UserList;

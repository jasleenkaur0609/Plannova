import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/getAllUser`);
        console.log("Raw response:", res.data);

        // Assuming it's an array of { id, data: { name, email, ... } }
        const extractedUsers = res.data.map((userWrapper) => userWrapper.data);
        setUsers(extractedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Unable to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 bg-[#F7E1D7] min-h-screen">
      <div className="flex-1 p-8 bg-[#F7E1D7] min-h-screen">
        <h1 className="text-3xl font-bold text-[#4A5759] mb-6">Users</h1>

        {loading ? (
          <p className="text-[#4A5759]">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-[#4A5759]">No users found.</p>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-[#B0C4B1] text-[#4A5759]">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || index} className="border-t hover:bg-[#F0F0F0]">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiRefreshCw } from "react-icons/fi"; // Import a refresh icon from react-icons

const TotalRegisteredUsers = ({ endpoint = "/api/customers/count", title = "Total Registered Users" }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(endpoint);
      console.log("Response from backend:", response.data); // Debugging log
      if (response.data && typeof response.data.totalCustomers === "number") {
        setTotalUsers(response.data.totalCustomers);
        setLastUpdated(new Date().toLocaleString()); // Set last updated time
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Failed to fetch total users.");
      }
    } catch (error) {
      console.error("Error fetching total users:", error);
      setError("Failed to fetch total users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center relative">
      {/* Refresh Icon in the Top-Right Corner */}
      <FiRefreshCw
        onClick={fetchTotalUsers}
        className="absolute top-4 right-4 text-blue-500 text-2xl cursor-pointer hover:text-blue-600 transition-all"
        title="Refresh"
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      ) : error ? (
        <div>
          <p className="text-red-500 mb-2">{error}</p>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>
        </div>
      )}
    </div>
  );
};

export default TotalRegisteredUsers;
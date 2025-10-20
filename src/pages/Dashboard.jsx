import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("name") || "Guest";

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/user-orders/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600 animate-pulse">
        Loading your orders...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800 drop-shadow-sm">
        📝 Your Print Orders
      </h2>

      <div className="overflow-x-auto rounded-3xl shadow-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-4 text-left uppercase tracking-wider">Token</th>
              <th className="p-4 text-left uppercase tracking-wider">File</th>
              <th className="p-4 text-left uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No uploads yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-4 font-medium text-gray-800">{order.tokenId}</td>
                  <td className="p-4">
                    <a
                      href={order.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 transition"
                    >
                      {order.filename}
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full font-medium text-sm shadow-sm ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        Keep track of your print jobs in real-time with PrintEase.
      </p>
    </div>
  );
}

export default Dashboard;

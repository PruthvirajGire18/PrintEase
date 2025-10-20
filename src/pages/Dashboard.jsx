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

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading your orders...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-md">Your Orders</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left">Token</th>
              <th className="p-3 text-left">File</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">No uploads yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-blue-50 transition">
                  <td className="p-3 font-medium">{order.tokenId}</td>
                  <td className="p-3">
                    <a href={order.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">
                      {order.filename}
                    </a>
                  </td>
                  <td className={`p-3 font-semibold ${order.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                    {order.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

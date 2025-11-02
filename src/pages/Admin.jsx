import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://print-ease-backend-tau.vercel.app/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://print-ease-backend-tau.vercel.app/api/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`https://print-ease-backend-tau.vercel.app/api/admin/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600 animate-pulse">
        Loading admin data...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white px-6 py-10">
      {/* Background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-200/40 rounded-full blur-3xl"></div>

      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-12 drop-shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🖨️ PrintEase Admin Dashboard
      </motion.h2>

      <div className="overflow-x-auto rounded-3xl shadow-2xl border border-gray-200 bg-white backdrop-blur-sm bg-opacity-90">
        <table className="min-w-full divide-y divide-gray-200 text-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white uppercase text-sm tracking-wider">
            <tr>
              <th className="p-4 text-left">Token ID</th>
              <th className="p-4 text-left">Filename</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Copies</th>
              <th className="p-4 text-left">Color</th>
              <th className="p-4 text-left">Double-Sided</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No orders available yet.
                </td>
              </tr>
            ) : (
              orders.map((o, index) => (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-4 font-semibold text-gray-800">{o.tokenId}</td>
                  <td className="p-4">
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 transition"
                    >
                      {o.filename}
                    </a>
                  </td>
                  <td className="p-4">{o.uploadedBy || "Guest"}</td>
                  <td className="p-4">{o.copies}</td>
                  <td className="p-4">{o.color}</td>
                  <td className="p-4">{o.doubleSided ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                        o.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : o.status === "Printed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option>Pending</option>
                      <option>Printed</option>
                      <option>Completed</option>
                    </select>

                    <button
                      onClick={() => deleteOrder(o._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow transition"
                    >
                      <FaTrashAlt size={14} /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        Manage and monitor print requests seamlessly ⚙️
      </p>
    </div>
  );
}

export default Admin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPrinter, FiFileText } from "react-icons/fi";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("name") || "Guest";

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await axios.get(
          `https://print-ease-backend-tau.vercel.app/api/admin/user-orders/${userId}`
        );
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 overflow-hidden px-6">
      {/* Background gradient circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-[30%] right-[40%] w-[250px] h-[250px] bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] p-10 w-full max-w-6xl z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <FiPrinter className="text-indigo-600 text-4xl" />
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Your Print Dashboard
          </h2>
        </motion.div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-4 text-left uppercase tracking-wider">Token</th>
                <th className="p-4 text-left uppercase tracking-wider flex items-center gap-2">
                  <FiFileText className="text-indigo-500" /> File
                </th>
                <th className="p-4 text-left uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-6 text-gray-500 italic"
                  >
                    No uploads yet. Start printing your first file!
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {order.tokenId}
                    </td>
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
                        className={`px-4 py-1.5 rounded-full font-medium text-sm shadow-sm ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : order.status === "Printed"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center text-gray-500 mt-6 text-sm"
        >
          Track your print jobs in real-time 📄 | Managed by <span className="font-semibold text-indigo-600">PrintEase</span>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Dashboard;

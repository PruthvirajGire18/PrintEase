import React, { useState } from "react";
import { FiSearch, FiRefreshCw, FiPackage } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";

function Track() {
  const [tokenId, setTokenId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!tokenId.trim()) return alert("Please enter Token ID");
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/track/${tokenId}`);
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      alert(err.response?.data?.error || "Order not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTokenId("");
    setOrder(null);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Printed":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 overflow-hidden px-6">
      {/* Background gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.1)] p-10 w-full max-w-2xl z-10"
      >
        {/* Header */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent drop-shadow-sm"
        >
          📦 Track Your Order
        </motion.h2>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter your Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="flex-1 p-4 rounded-2xl border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
          />

          <button
            onClick={handleTrack}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:shadow-xl"
            }`}
          >
            <FiSearch size={18} />
            {loading ? "Tracking..." : "Track"}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transition shadow"
          >
            <FiRefreshCw size={18} />
            Reset
          </button>
        </div>

        {/* Order Card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-md p-8 mt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiPackage size={28} className="text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
            </div>

            <div className="space-y-4 text-base">
              <p>
                <strong>🎫 Token ID:</strong>{" "}
                <span className="text-gray-800">{order.tokenId}</span>
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-semibold border ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </p>
              <p>
                <strong>💰 Paid:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.paid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.paid ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong>👤 User:</strong> {order.uploadedBy || "Guest"}
              </p>
              <p>
                <strong>📄 File:</strong>{" "}
                <a
                  href={order.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline hover:text-blue-700 transition"
                >
                  {order.filename}
                </a>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-2">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      order.status === "Completed"
                        ? "100%"
                        : order.status === "Printed"
                        ? "70%"
                        : "30%",
                  }}
                  transition={{ duration: 1 }}
                  className={`h-3 rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-500"
                      : order.status === "Printed"
                      ? "bg-yellow-500"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Not Found */}
        {!order && !loading && tokenId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mt-6 font-medium text-center"
          >
            No order found with this Token ID 😕
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default Track;

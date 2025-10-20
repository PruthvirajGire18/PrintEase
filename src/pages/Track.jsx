import React, { useState } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import axios from "axios";

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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 overflow-hidden">
      {/* Soft background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-200/20 rounded-full blur-3xl"></div>

      <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 drop-shadow-sm">
        📦 Track Your Order
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 shadow-sm"
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition shadow-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105 transform"
          }`}
        >
          <FiSearch />
          {loading ? "Tracking..." : "Track"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-gray-500 text-white hover:bg-gray-600 transition shadow"
        >
          <FiRefreshCw />
          Reset
        </button>
      </div>

      {order && (
        <div className="bg-white border border-gray-200 shadow rounded-3xl p-6 w-full max-w-md text-gray-700 space-y-3 transition transform hover:scale-[1.02]">
          <p><strong>Token ID:</strong> {order.tokenId}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-semibold ${
              order.status === "Completed" ? "text-green-600" :
              order.status === "Printed" ? "text-yellow-600" : "text-red-500"
            }`}>{order.status}</span>
          </p>
          <p><strong>Paid:</strong> {order.paid ? "Yes" : "No"}</p>
          <p><strong>User:</strong> {order.uploadedBy || "Guest"}</p>
          <p>
            <strong>File:</strong>{" "}
            <a
              href={order.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              {order.filename}
            </a>
          </p>
        </div>
      )}

      {!order && !loading && tokenId && (
        <p className="text-red-500 mt-4 font-medium">
          No order found with this Token ID
        </p>
      )}
    </div>
  );
}

export default Track;

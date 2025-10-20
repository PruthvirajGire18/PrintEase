import React, { useState } from "react";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6">📦 Track Your Order</h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transform"
          }`}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl font-semibold bg-gray-500 text-white hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {order && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-gray-700 space-y-2 border border-gray-200">
          <p><strong>Token ID:</strong> {order.tokenId}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${order.status === "Completed" ? "text-green-600" : order.status === "Printed" ? "text-yellow-600" : "text-red-500"}`}>{order.status}</span></p>
          <p><strong>Paid:</strong> {order.paid ? "Yes" : "No"}</p>
          <p><strong>User:</strong> {order.uploadedBy}</p>
          <p>
            <strong>File:</strong>{" "}
            <a href={order.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
              {order.filename}
            </a>
          </p>
        </div>
      )}

      {!order && !loading && tokenId && (
        <p className="text-red-500 mt-4">No order found with this Token ID</p>
      )}
    </div>
  );
}

export default Track;

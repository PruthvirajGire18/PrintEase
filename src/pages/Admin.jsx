import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
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
      await axios.put(`http://localhost:5000/api/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-semibold text-lg">
      Loading orders...
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">🖨️ Admin Dashboard</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Token ID</th>
              <th className="p-3">Filename</th>
              <th className="p-3">User</th>
              <th className="p-3">Copies</th>
              <th className="p-3">Color</th>
              <th className="p-3">Double-Sided</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="text-center hover:bg-blue-50 transition">
                <td className="p-3 font-medium">{o.tokenId}</td>
                <td className="p-3">
                  <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">
                    {o.filename}
                  </a>
                </td>
                <td className="p-3">{o.uploadedBy || "Guest"}</td>
                <td className="p-3">{o.copies}</td>
                <td className="p-3">{o.color}</td>
                <td className="p-3">{o.doubleSided ? "Yes" : "No"}</td>
                <td className={`p-3 font-semibold ${o.status === "Completed" ? "text-green-600" : o.status === "Printed" ? "text-yellow-600" : "text-red-500"}`}>
                  {o.status}
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="border px-2 py-1 rounded-md"
                  >
                    <option>Pending</option>
                    <option>Printed</option>
                    <option>Completed</option>
                  </select>
                  <button
                    onClick={() => deleteOrder(o._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;

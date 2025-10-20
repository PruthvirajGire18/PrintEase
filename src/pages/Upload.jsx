import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("color");
  const [doubleSided, setDoubleSided] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected && selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else setPreview(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", localStorage.getItem("name") || "Guest");
    formData.append("copies", copies);
    formData.append("color", color);
    formData.append("doubleSided", doubleSided);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      if (res.data.success) {
        alert(`✅ File uploaded! Token ID: ${res.data.order.tokenId}`);
        setFile(null); setPreview(null); e.target.reset();
      } else alert("⚠️ Upload failed.");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-6 overflow-hidden">
      {/* Soft background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-300/20 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Form container */}
      <div className="relative bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-10 sm:p-14 max-w-md w-full animate-fadeInUp">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          🖨️ Upload Document
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">
          <input
            type="file"
            accept=".pdf,.docx,.jpg,.png"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border border-gray-300 shadow-sm"
            />
          )}

          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className="border p-3 rounded-xl w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Copies"
            />
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border p-3 rounded-xl w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="color">Color</option>
              <option value="bw">Black & White</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={doubleSided}
              onChange={(e) => setDoubleSided(e.target.checked)}
              className="h-5 w-5 accent-blue-500"
            />
            <span>Print Double-Sided</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold transition shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.03] hover:shadow-xl"
            }`}
          >
            <FiUpload size={20} />
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;

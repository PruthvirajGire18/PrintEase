import React, { useState } from "react";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Upload() {
  const [file, setFile] = useState(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("color");
  const [doubleSided, setDoubleSided] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected && selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
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
        alert(`✅ File uploaded successfully! Token ID: ${res.data.order.tokenId}`);
        setFile(null);
        setPreview(null);
        e.target.reset();
        navigate("/dashboard");
      } else {
        alert("⚠️ Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Left Section */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 bg-gradient-to-br from-indigo-600 to-blue-600 text-white relative"
      >

        <div className="z-10">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Print Smarter.<br />Work Faster.
          </h1>
          <p className="text-lg text-blue-100 max-w-md mb-10">
            Upload, customize, and print your documents with ease — all in one seamless dashboard.
          </p>
          <div className="w-24 h-[4px] bg-white/70 rounded-full"></div>
        </div>

        <div className="absolute bottom-10 left-10 text-sm text-blue-200 opacity-80">
          © 2025 PrintEase — All rights reserved.
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.9 }}
        className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12"
      >
        <div className="relative bg-white/90 backdrop-blur-lg border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 sm:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            🖨️ Upload Your Document
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Upload Zone */}
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-indigo-300 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-100/50 cursor-pointer rounded-2xl py-10 transition-all duration-300 group">
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <FiUpload
                size={42}
                className="text-indigo-500 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="mt-3 text-gray-700 font-medium group-hover:text-indigo-600 transition">
                {file ? file.name : "Click to select a file"}
              </span>
              <p className="text-xs text-gray-500 mt-1">(PDF, DOCX, JPG, PNG)</p>
            </label>

            {/* Preview */}
            {preview && (
              <motion.img
                src={preview}
                alt="Preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
            )}

            {/* Print Options */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  Copies
                </label>
                <input
                  type="number"
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  Color Mode
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="color">Color</option>
                  <option value="bw">Black & White</option>
                </select>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={doubleSided}
                onChange={(e) => setDoubleSided(e.target.checked)}
                className="h-5 w-5 accent-indigo-600"
              />
              <span>Print Double-Sided</span>
            </label>

            {/* Upload Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <FiCheckCircle size={20} />
                  Upload File
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Upload;

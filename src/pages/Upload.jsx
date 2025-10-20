import React, { useState } from "react";
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
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">🖨️ Upload Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" accept=".pdf,.docx,.jpg,.png" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded-md"/>
          {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md border"/>}
          <div className="flex gap-3">
            <input type="number" min="1" value={copies} onChange={(e) => setCopies(e.target.value)} className="border p-2 rounded-md w-1/2" placeholder="Copies"/>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="border p-2 rounded-md w-1/2">
              <option value="color">Color</option>
              <option value="bw">Black & White</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={doubleSided} onChange={(e) => setDoubleSided(e.target.checked)} />
            <span>Print Double-Sided</span>
          </label>
          <button type="submit" disabled={loading} className={`w-full py-2 rounded-2xl text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transform"}`}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;

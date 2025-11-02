import React, { useState } from "react";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

function Upload() {
  const [files, setFiles] = useState([]);
  const [filePages, setFilePages] = useState({}); // Store pages count for each file
  const [fileCopies, setFileCopies] = useState({}); // Store copies count for each file
  const [fileColor, setFileColor] = useState({}); // Store color mode for each file
  const [fileDoubleSided, setFileDoubleSided] = useState({}); // Store doubleSided for each file
  const [loading, setLoading] = useState(false);

  const getPDFPageCount = async (file) => {
    if (file.type !== 'application/pdf') return 1; // Non-PDF files count as 1 page
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      console.error("Error reading PDF:", error);
      return 6; // Default fallback
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Get page count and initialize settings for each file
    const pagesObj = {};
    const copiesObj = {};
    const colorObj = {};
    const doubleSidedObj = {};
    for (let i = 0; i < selectedFiles.length; i++) {
      const pageCount = await getPDFPageCount(selectedFiles[i]);
      pagesObj[i] = pageCount;
      copiesObj[i] = 1; // Default 1 copy
      colorObj[i] = "color"; // Default color
      doubleSidedObj[i] = false; // Default single-sided
    }
    setFilePages(pagesObj);
    setFileCopies(copiesObj);
    setFileColor(colorObj);
    setFileDoubleSided(doubleSidedObj);
  };
  
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    // Remove corresponding data
    const newPages = { ...filePages };
    const newCopies = { ...fileCopies };
    const newColor = { ...fileColor };
    const newDoubleSided = { ...fileDoubleSided };
    delete newPages[index];
    delete newCopies[index];
    delete newColor[index];
    delete newDoubleSided[index];
    setFilePages(newPages);
    setFileCopies(newCopies);
    setFileColor(newColor);
    setFileDoubleSided(newDoubleSided);
  };
  
  const handlePagesChange = (index, pages) => {
    setFilePages({ ...filePages, [index]: parseInt(pages) });
  };
  
  const handleCopiesChange = (index, copies) => {
    setFileCopies({ ...fileCopies, [index]: parseInt(copies) });
  };
  
  const handleColorChange = (index, color) => {
    setFileColor({ ...fileColor, [index]: color });
  };
  
  const handleDoubleSidedChange = (index, doubleSided) => {
    setFileDoubleSided({ ...fileDoubleSided, [index]: doubleSided });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file.");

    try {
      setLoading(true);
      
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        alert("❌ Razorpay not loaded. Refresh page.");
        setLoading(false);
        return;
      }
      
      // Calculate amount based on pages, copies, and color mode per file
      let totalAmount = 0;
      files.forEach((file, index) => {
        const pages = filePages[index] || 1;
        const copies = fileCopies[index] || 1;
        const color = fileColor[index] || "color";
        const pricePerPage = color === "color" ? 5 : 2; // ₹5 for color, ₹2 for BW
        totalAmount += pages * copies * pricePerPage;
      });
      
      const amount = totalAmount * 100; // Convert to paise (100 paise = 1 INR)
      
      var options = {
        key: "rzp_test_Ra9fEmIOrbpoXw",
        amount: amount,
        currency: "INR",
        name: "PrintEase",
        description: `Print Order - ${files.length} file(s)`,
        handler: async function (response) {
          console.log("✅ Payment Success:", response);
          
          try {
            // Upload files to backend after payment success
            const formData = new FormData();
            
            // Append all files
            files.forEach((file) => {
              formData.append("files", file);
            });
            
            // Prepare files data with metadata
            const filesData = files.map((file, index) => ({
              name: file.name,
              pages: filePages[index] || 1,
              copies: fileCopies[index] || 1,
              color: fileColor[index] || "color",
              doubleSided: fileDoubleSided[index] || false
            }));
            
            formData.append("filesData", JSON.stringify(filesData));
            formData.append("paymentId", response.razorpay_payment_id);
            
            // Upload to backend
            const uploadRes = await axios.post("https://print-ease-backend-tau.vercel.app/api/upload", formData, {
              headers: {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "multipart/form-data"
              }
            });
            
            if (uploadRes.data.success) {
              alert(`✅ Payment & Upload successful!\nOrder Number: ${uploadRes.data.order.orderNumber}\nPayment ID: ${response.razorpay_payment_id}`);
              setFiles([]);
              setFilePages({});
              setFileCopies({});
              setFileColor({});
              setFileDoubleSided({});
              e.target.reset();
            } else {
              alert("⚠️ Payment successful but upload failed. Please contact support.");
            }
          } catch (uploadErr) {
            console.error("Upload error:", uploadErr);
            alert("⚠️ Payment successful but upload failed. Please contact support with Payment ID: " + response.razorpay_payment_id);
          }
          
          setLoading(false);
        },
        prefill: {
          name: localStorage.getItem("name") || "Guest",
          contact: "9999999999",
          email: ""
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      console.log("Opening Razorpay with options:", options);
      
      var rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("❌ Payment Failed:", response.error);
        alert("❌ Payment Failed!\n" + response.error.description);
        setLoading(false);
      });
      
      rzp.on('payment.authorized', function (response) {
        console.log("✅ Payment Authorized:", response);
      });
      
      rzp.on('error', function (error) {
        console.error("❌ Razorpay Error:", error);
        alert("❌ Error: " + error.description);
        setLoading(false);
      });
      
      rzp.open();
      
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">🖨️ Upload Documents</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <input 
              type="file" 
              accept=".pdf,.docx,.jpg,.png" 
              onChange={handleFileChange} 
              multiple
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-gray-700">Selected Files ({files.length}):</p>
                {files.map((file, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-gray-600">Pages:</label>
                        <input
                          type="number"
                          min="1"
                          value={filePages[index] || 1}
                          onChange={(e) => handlePagesChange(index, e.target.value)}
                          className="border p-1 rounded w-16 text-sm"
                        />
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-gray-600">Copies:</label>
                          <input
                            type="number"
                            min="1"
                            value={fileCopies[index] || 1}
                            onChange={(e) => handleCopiesChange(index, e.target.value)}
                            className="border p-1 rounded w-16 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <select 
                          value={fileColor[index] || "color"} 
                          onChange={(e) => handleColorChange(index, e.target.value)} 
                          className="border p-1 rounded text-xs w-24"
                        >
                          <option value="color">Color ₹5</option>
                          <option value="bw">B&W ₹2</option>
                        </select>
                        <label className="flex items-center gap-1 text-xs">
                          <input 
                            type="checkbox" 
                            checked={fileDoubleSided[index] || false}
                            onChange={(e) => handleDoubleSidedChange(index, e.target.checked)} 
                          />
                          <span>2-Sided</span>
                        </label>
                        <span className="text-xs font-semibold text-blue-800">
                          = ₹{((filePages[index] || 1) * (fileCopies[index] || 1) * ((fileColor[index] || "color") === "color" ? 5 : 2))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {files.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-semibold text-blue-800">
                Total Amount: ₹{files.reduce((sum, file, index) => {
                  const pages = filePages[index] || 1;
                  const copies = fileCopies[index] || 1;
                  const color = fileColor[index] || "color";
                  const pricePerPage = color === "color" ? 5 : 2;
                  return sum + (pages * copies * pricePerPage);
                }, 0).toFixed(2)}
              </p>
              <p className="text-xs text-blue-600">
                {files.length} file(s) × (Color: ₹5/page, B&W: ₹2/page)
              </p>
            </div>
          )}
          
          <button type="submit" disabled={loading} className={`w-full py-2 rounded-2xl text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transform"}`}>
            {loading ? "Processing..." : "💳 Pay Online"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;

import React from "react";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt, FaSearch } from "react-icons/fa";

function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 px-6">
      {/* Subtle background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gray-300/30 rounded-full blur-3xl animate-pulse-slow" />

      {/* Main container */}
      <div className="relative backdrop-blur-xl bg-white/60 border border-gray-200 rounded-3xl shadow-xl p-10 sm:p-14 text-center max-w-3xl animate-fadeInUp">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-gray-700">
          Welcome to PrintEase
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed">
          Simplify your printing experience — Upload, customize, pay securely, 
          and track your prints effortlessly. Professional printing made easy.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/upload"
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            <FaCloudUploadAlt size={20} />
            Upload Documents
          </Link>

          <Link
            to="/track"
            className="flex items-center justify-center gap-3 bg-white text-blue-700 border border-blue-600 px-8 py-4 rounded-full font-medium hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 shadow-md"
          >
            <FaSearch size={20} />
            Track Order
          </Link>
        </div>
      </div>

      {/* Footer tagline */}
      <p className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} PrintEase — Your Trusted Printing Partner
      </p>
    </div>
  );
}

export default Home;

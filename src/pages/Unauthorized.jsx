import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-50 px-4 animate-fadeIn">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-red-600 mb-6 drop-shadow-lg">🚫 Unauthorized</h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-8 text-center max-w-md">
        You do not have permission to view this page. Please login with the appropriate account.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition transform shadow-lg"
      >
        <FiHome size={20} /> Go to Home
      </Link>
    </div>
  );
}

export default Unauthorized;

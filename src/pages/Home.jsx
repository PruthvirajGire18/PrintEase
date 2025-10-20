import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <h1 className="text-6xl font-extrabold mb-4 text-blue-800 drop-shadow-lg">Welcome to PrintEase</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl text-center">
        Upload your documents online, choose print settings, pay easily, and track your orders instantly using your unique Token ID.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/upload" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition transform shadow-lg">
          Upload Now
        </Link>
        <Link to="/track" className="bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition shadow">
          Track Order
        </Link>
      </div>
    </div>
  );
}

export default Home;

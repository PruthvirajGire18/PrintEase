import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user.token;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="text-2xl font-extrabold tracking-wide">PrintEase</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center font-semibold text-lg">
          {!isLoggedIn && <Link to="/login" className="hover:text-gray-200 transition">Login</Link>}
          {isLoggedIn && (
            <>
              <Link to="/upload" className="hover:text-gray-200 transition">Upload</Link>
              <Link to="/track" className="hover:text-gray-200 transition">Track</Link>
              {user.role === "user" && <Link to="/dashboard" className="hover:text-gray-200 transition">Dashboard</Link>}
              {user.role === "admin" && <Link to="/admin" className="hover:text-gray-200 transition">Admin</Link>}
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition shadow-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-blue-700 text-white px-6 py-3 space-y-2 font-medium">
          {!isLoggedIn && <Link to="/login" className="block hover:text-gray-200 transition">Login</Link>}
          {isLoggedIn && (
            <>
              <Link to="/upload" className="block hover:text-gray-200 transition">Upload</Link>
              <Link to="/track" className="block hover:text-gray-200 transition">Track</Link>
              {user.role === "user" && <Link to="/dashboard" className="block hover:text-gray-200 transition">Dashboard</Link>}
              {user.role === "admin" && <Link to="/admin" className="block hover:text-gray-200 transition">Admin</Link>}
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition shadow-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

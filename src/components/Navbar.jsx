import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user.token;

  return (
    <nav className="backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition"
        >
          PrintEase
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
          {!isLoggedIn && (
            <Link
              to="/login"
              className="hover:text-blue-600 transition duration-300"
            >
              Login
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link
                to="/upload"
                className="hover:text-blue-600 transition duration-300"
              >
                Upload
              </Link>
              <Link
                to="/track"
                className="hover:text-blue-600 transition duration-300"
              >
                Track
              </Link>

              {user.role === "user" && (
                <Link
                  to="/dashboard"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden cursor-pointer text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 text-gray-800 px-6 py-4 font-medium space-y-3 transition-all duration-300 ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {!isLoggedIn && (
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block hover:text-blue-600 transition duration-300"
          >
            Login
          </Link>
        )}

        {isLoggedIn && (
          <>
            <Link
              to="/upload"
              onClick={() => setOpen(false)}
              className="block hover:text-blue-600 transition duration-300"
            >
              Upload
            </Link>
            <Link
              to="/track"
              onClick={() => setOpen(false)}
              className="block hover:text-blue-600 transition duration-300"
            >
              Track
            </Link>

            {user.role === "user" && (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block hover:text-blue-600 transition duration-300"
              >
                Dashboard
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block hover:text-blue-600 transition duration-300"
              >
                Admin
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

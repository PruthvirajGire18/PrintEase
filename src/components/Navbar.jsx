import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user.token;

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition duration-300"
        >
          PrintEase
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
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
                className="relative group"
              >
                <span className="hover:text-blue-600 transition duration-300">
                  Upload
                </span>
                <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-blue-600 transition-all duration-300"></span>
              </Link>

              <Link
                to="/track"
                className="relative group"
              >
                <span className="hover:text-blue-600 transition duration-300">
                  Track
                </span>
                <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-blue-600 transition-all duration-300"></span>
              </Link>

              {user.role === "user" && (
                <Link
                  to="/dashboard"
                  className="relative group"
                >
                  <span className="hover:text-blue-600 transition duration-300">
                    Dashboard
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-blue-600 transition-all duration-300"></span>
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="relative group"
                >
                  <span className="hover:text-blue-600 transition duration-300">
                    Admin
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 group-hover:w-full h-[2px] bg-blue-600 transition-all duration-300"></span>
                </Link>
              )}

              <button
                onClick={logout}
                className="ml-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-full hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden cursor-pointer text-gray-700 hover:text-blue-600 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/80 backdrop-blur-lg border-t border-gray-200 px-6 py-4 font-medium text-gray-800 space-y-3 shadow-lg rounded-b-2xl"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

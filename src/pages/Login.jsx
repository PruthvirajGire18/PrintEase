import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      login({
        token: res.data.token,
        role: res.data.user.role,
        name: res.data.user.name || "",
      });
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-3xl p-10 transition-all duration-500">
        <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-gray-700">
          Sign in to PrintEase
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <FiMail
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FiLock
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="w-1/3 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="w-1/3 border-t border-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition text-gray-700"
          >
            <i className="fab fa-google text-red-500"></i> Google
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition text-gray-700"
          >
            <i className="fab fa-facebook text-blue-600"></i> Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

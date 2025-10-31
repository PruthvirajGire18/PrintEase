import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate(); // For signup navigation only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("Login response:", res.data);
      login({ token: res.data.token, role: res.data.user.role, name: res.data.user.name || "" });
      // Navigation is handled by AuthContext
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error details:", err.response?.data);
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            required className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            required className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-2xl text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transform"}`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;

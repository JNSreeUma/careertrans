import { useState, useEffect } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async () => {
    const data = await loginUser({ email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden relative">

      {/* 🔥 Animated Background */}
      <motion.div
        animate={{ x: [0, 60, -60, 0], y: [0, -60, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute w-[300px] h-[300px] bg-indigo-400/30 rounded-full blur-3xl bottom-[-80px] right-[-80px]"
      />

      {/* 💎 CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 rounded-2xl w-[360px]"
      >

        {/* LOGO */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xl font-semibold text-white mb-6"
        >
          🚀 CareerTrans
        </motion.h1>

        <p className="text-center text-gray-400 mb-6">
          Welcome back
        </p>

        {/* INPUTS */}
        <div className="space-y-4">

          {/* EMAIL */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center bg-white/10 px-3 rounded-lg focus-within:ring-2 focus-within:ring-purple-400 transition"
          >
            <Mail size={18} className="text-gray-400" />
            <input
              placeholder="Email"
              className="w-full p-3 bg-transparent text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          {/* PASSWORD WITH TOGGLE */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center bg-white/10 px-3 rounded-lg focus-within:ring-2 focus-within:ring-purple-400 transition"
          >
            <Lock size={18} className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-transparent text-white outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁️ TOGGLE */}
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </motion.div>

          {/* LOGIN BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-lg font-medium shadow-lg hover:shadow-purple-400/40 transition"
          >
            Login
          </motion.button>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-6 text-gray-400 text-sm">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <span className="px-3">OR</span>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* GOOGLE (OPTIONAL UI ONLY) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full bg-white text-black p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition opacity-60 cursor-not-allowed"
          disabled
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Coming Soon
        </motion.button>

        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-400 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </motion.div>
    </div>
  );
}
import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({ name, email, password });

      if (data._id) {
        toast.success("Account created 🎉");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">

      {/* 🔥 Animated Background */}
      <motion.div
        animate={{ x: [0, 60, -60, 0], y: [0, -60, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] bg-green-500/30 rounded-full blur-3xl top-[-100px] left-[-100px]"
      />

      {/* 💎 CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 rounded-2xl w-[360px]"
      >
        <h1 className="text-center text-white text-xl mb-6">
          🚀 CareerTrans
        </h1>

        <div className="space-y-4">

          {/* NAME */}
          <div className="flex items-center bg-white/10 px-3 rounded-lg">
            <User size={18} className="text-gray-400" />
            <input
              placeholder="Name"
              className="w-full p-3 bg-transparent text-white outline-none"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center bg-white/10 px-3 rounded-lg">
            <Mail size={18} className="text-gray-400" />
            <input
              placeholder="Email"
              className="w-full p-3 bg-transparent text-white outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD + TOGGLE */}
          <div className="flex items-center bg-white/10 px-3 rounded-lg">
            <Lock size={18} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-transparent text-white outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </div>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
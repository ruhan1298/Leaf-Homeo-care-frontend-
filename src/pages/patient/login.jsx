import { Link } from "react-router-dom";
import { useState } from "react";
import { Leaf, Lock, Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2faf2] via-white to-brand-light flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100/80 p-8 relative z-10 animate-scaleUp">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-primary border border-brand-primary/10 shadow-xs mb-4">
            <Leaf size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Leaf Homeo Care
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Patient Portal Login
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="patient@email.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-12 rounded-xl border border-gray-200 text-sm outline-hidden transition-all bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-11 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-xl shadow-md shadow-brand-primary/20 transition-all cursor-pointer flex items-center justify-center"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-primary font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
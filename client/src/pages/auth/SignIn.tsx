import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../lib/axios";
import { useNavigate } from "react-router";
import Navbar from "../../landingpage/Navbar";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize Google Sign-In button only once
    const initGoogleSignIn = () => {
      // @ts-expect-error - Google Sign-In loaded from CDN
      if (!window.google || !googleButtonRef.current) {
        console.log("Waiting for Google SDK or button ref...");
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID not configured");
        return;
      }
      // @ts-expect-error - Google Sign-In loaded from CDN
      window.google.accounts.id.initialize({
        client_id: clientId,
        use_fedcm_for_prompt: false,
        callback: handleGoogleCallback,
      });

      // @ts-expect-error - Google Sign-In loaded from CDN
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: googleButtonRef.current.offsetWidth,
        text: "signin_with",
      });
    };

    // Wait for Google SDK to load
    const checkGoogleLoaded = setInterval(() => {
      // @ts-expect-error - Google Sign-In loaded from CDN
      if (window.google) {
        clearInterval(checkGoogleLoaded);
        initGoogleSignIn();
      }
    }, 100);

    return () => clearInterval(checkGoogleLoaded);
  }, []);

  const handleGoogleCallback = async (response: any) => {
    setLoading(true);
    setError("");

    try {
      const result = await axiosInstance.post("/auth/student/google", {
        idToken: response.credential,
      });
      localStorage.setItem("user", JSON.stringify(result.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Google Sign-In failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const fillTestCredentials = () => {
    setFormData({
      emailId: "demo@flowml.com",
      password: "Demo@12345",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/auth/student/login",
        formData,
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-50 px-4 pt-24 pb-12 relative overflow-hidden">
      <Navbar variant="auth-signin" />
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 bg-linear-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Sign in to continue building amazing ML projects
          </p>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 p-8 space-y-6 border border-slate-200/60 ring-1 ring-slate-900/5"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-800 flex-1">{error}</p>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-900">Test credentials</p>
              <p className="mt-1 text-xs text-amber-800">demo@flowml.com · Demo@12345</p>
            </div>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
            >
              Use test account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="emailId"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 " />
                </div>
                <input
                  id="emailId"
                  name="emailId"
                  type="email"
                  required
                  value={formData.emailId}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm hover:shadow-md backdrop-blur-sm font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 " />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm hover:shadow-md backdrop-blur-sm font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-700 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a
                href="/auth/forgot-password"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:shadow-slate-900/40 shadow-slate-900/25"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Google sign-in is temporarily unavailable. */}
          {false && (
            <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="w-full">
            <div ref={googleButtonRef} className="w-full"></div>
          </div>
            </>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <motion.a
              onClick={() => navigate("/signup")}
              whileHover={{ scale: 1.05 }}
              className="font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer inline-block"
            >
              Sign up
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;

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
    <div className="min-h-screen bg-[#F4F6FF]">
      <Navbar variant="auth-signin" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 pt-28 pb-16 lg:px-8">
        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to continue building amazing ML projects.
            </p>
          </div>

          <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <span className="text-xs font-bold text-red-600">!</span>
                </div>
                <p className="flex-1 text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm leading-6 text-indigo-950">
                Visual ML is currently in ideation mode and available as a beta
                for testing and feedback. A more complete, industry-ready
                version is launching soon.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  Test credentials
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  demo@flowml.com · Demo@12345
                </p>
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
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="emailId"
                    name="emailId"
                    type="email"
                    required
                    value={formData.emailId}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 transition-colors hover:text-slate-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 transition-colors hover:text-slate-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-amber-700 transition-colors hover:text-amber-800"
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
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-[#D97706] px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-[#B45309] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <motion.a
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                className="inline-block cursor-pointer font-semibold text-amber-700 transition-colors hover:text-amber-800"
              >
                Sign up
              </motion.a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;

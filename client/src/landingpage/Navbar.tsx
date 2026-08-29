import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

type NavbarVariant = "landing" | "auth-signin" | "auth-signup" | "profile";

interface NavbarProps {
  variant?: NavbarVariant;
}

const Navbar: React.FC<NavbarProps> = ({ variant = "landing" }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Algorithms", href: "#algorithms" },
    { label: "How it works", href: "#workflow" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm shadow-slate-900/5"
          : "bg-[#F4F6FF]/80 backdrop-blur-md border-b border-slate-200/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
        <button
          onClick={() =>
            variant === "landing"
              ? window.scrollTo({ top: 0, behavior: "smooth" })
              : navigate("/")
          }
          className="flex items-center gap-2.5"
        >
          <div className="w-6 h-6 bg-indigo-500 rounded-[5px] grid place-items-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="3" cy="3" r="1.5" fill="white" />
              <circle cx="9" cy="3" r="1.5" fill="white" opacity="0.45" />
              <circle cx="3" cy="9" r="1.5" fill="white" opacity="0.45" />
              <circle cx="9" cy="9" r="1.5" fill="white" />
              <path
                d="M4.5 3H7.5M3 4.5V7.5M9 4.5V7.5M4.5 9H7.5"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-slate-900">
            Flow ML
          </span>
          {variant === "landing" && (
            <span className="border-l border-slate-300 pl-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Beta version
            </span>
          )}
        </button>

        {variant === "landing" && (
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {variant === "landing" && (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-[13px] font-medium bg-[#D97706] text-white hover:bg-[#B45309] transition-colors px-3.5 py-1.5 rounded-md"
              >
                Start free
              </button>
            </>
          )}
          {variant === "auth-signin" && (
            <button
              onClick={() => navigate("/signup")}
              className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Create account
            </button>
          )}
          {variant === "auth-signup" && (
            <button
              onClick={() => navigate("/signin")}
              className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

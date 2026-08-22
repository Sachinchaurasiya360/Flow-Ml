import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

type NavbarVariant = "landing" | "auth-signin" | "auth-signup" | "profile";

interface NavbarProps {
  variant?: NavbarVariant;
}

const Navbar: React.FC<NavbarProps> = ({ variant = "landing" }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300 ${
          scrolled
            ? "bg-neutral-950/92 backdrop-blur-md border-b border-white/[0.06]"
            : "bg-transparent"
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
            <span className="text-[13px] font-semibold text-neutral-100 tracking-tight">
              Flow ML
            </span>
            {variant === "landing" && (
              <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-300">
                Beta mode
              </span>
            )}
          </button>

          {variant === "landing" && (
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-neutral-500 hover:text-neutral-200 transition-colors duration-200"
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
                  className="hidden md:block text-[13px] text-neutral-500 hover:text-neutral-200 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-[13px] font-medium bg-neutral-100 text-neutral-950 hover:bg-white transition-colors px-3.5 py-1.5 rounded-md"
                >
                  Start free
                </button>
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden text-neutral-400 p-1"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </>
            )}
            {variant === "auth-signin" && (
              <button
                onClick={() => navigate("/signup")}
                className="text-[13px] text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                Create account
              </button>
            )}
            {variant === "auth-signup" && (
              <button
                onClick={() => navigate("/signin")}
                className="text-[13px] text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-0 inset-x-0 bg-neutral-900 border-b border-white/[0.06] p-6"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-neutral-100">
                  Flow ML
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-white/[0.06] flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigate("/signin");
                    setMobileOpen(false);
                  }}
                  className="py-2.5 text-sm text-neutral-400 text-center"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileOpen(false);
                  }}
                  className="py-2.5 text-sm font-medium bg-neutral-100 text-neutral-950 rounded-md text-center"
                >
                  Start free
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

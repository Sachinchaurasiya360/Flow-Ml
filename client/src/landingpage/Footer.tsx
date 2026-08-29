import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Algorithms", href: "#algorithms" },
    { label: "How it works", href: "#workflow" },
  ],
  Resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Community", href: "#community" },
    { label: "Support", href: "#support" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Blog", href: "#blog" },
  ],
};

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* CTA band */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Ready to build your first pipeline?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Start free — no installation required.
            </p>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#D97706] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B45309]"
          >
            Start learning free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Link grid */}
        <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-[5px] bg-indigo-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="3" cy="3" r="1.5" fill="white" />
                  <circle cx="9" cy="3" r="1.5" fill="white" opacity="0.45" />
                  <circle cx="3" cy="9" r="1.5" fill="white" opacity="0.45" />
                  <circle cx="9" cy="9" r="1.5" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Visual ML
              </span>
            </div>
            <p className="max-w-[220px] text-[13px] leading-relaxed text-slate-600">
              Visual machine learning for students and educators — build,
              run, and understand pipelines without writing code.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-slate-600 transition-colors hover:text-amber-700"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-[12px] text-slate-500">
            &copy; 2026 Visual ML. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[12px] text-slate-500 transition-colors hover:text-amber-700"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[12px] text-slate-500 transition-colors hover:text-amber-700"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


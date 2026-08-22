import React from "react";

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
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-indigo-100 bg-[#F4F6FF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-indigo-500 rounded-[4px] grid place-items-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="2.5" cy="2.5" r="1.2" fill="white" />
                  <circle
                    cx="7.5"
                    cy="2.5"
                    r="1.2"
                    fill="white"
                    opacity="0.4"
                  />
                  <circle
                    cx="2.5"
                    cy="7.5"
                    r="1.2"
                    fill="white"
                    opacity="0.4"
                  />
                  <circle cx="7.5" cy="7.5" r="1.2" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Flow ML
              </span>
            </div>
            <p className="max-w-[180px] text-[13px] leading-relaxed text-slate-600">
              Visual machine learning for students and educators.
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

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-indigo-100 pt-8 sm:flex-row">
          <p className="text-[12px] text-slate-500">
            &copy; 2026 Flow ML. All rights reserved.
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

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
    <footer className="bg-neutral-950 border-t border-white/[0.06]">
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
              <span className="text-sm font-semibold text-neutral-100">
                Flow ML
              </span>
            </div>
            <p className="text-[13px] text-neutral-600 leading-relaxed max-w-[180px]">
              Visual machine learning for students and educators.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-neutral-600 hover:text-neutral-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-neutral-700">
            &copy; 2026 Flow ML. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[12px] text-neutral-700 hover:text-neutral-500 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[12px] text-neutral-700 hover:text-neutral-500 transition-colors"
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

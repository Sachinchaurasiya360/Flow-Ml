import React from "react";
import { motion } from "framer-motion";

const STATS = [
  { value: "4,000+", label: "Students enrolled" },
  { value: "18", label: "ML algorithms" },
  { value: "12,000+", label: "Pipelines built" },
  { value: "40+", label: "Universities" },
];

const UNIVERSITIES = [
  "IIT Bombay",
  "IIT Delhi",
  "NIT Trichy",
  "BITS Pilani",
  "VIT Vellore",
  "Anna University",
];

const SocialProof: React.FC = () => {
  return (
    <section className="border-y border-white/[0.06] bg-neutral-900/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center md:text-left"
            >
              <p className="text-2xl lg:text-3xl font-bold text-neutral-100 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-600 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.04] mb-12" />

        {/* University labels */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 shrink-0">
            Taught at
          </p>
          {UNIVERSITIES.map((uni, i) => (
            <motion.span
              key={uni}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors cursor-default"
            >
              {uni}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

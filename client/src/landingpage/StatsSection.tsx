import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "10k+", label: "Models trained" },
  { value: "500+", label: "Active learners" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "50+", label: "Ready templates" },
];

const StatsSection: React.FC = () => (
  <section className="border-y border-indigo-100 bg-[#F4F6FF] py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto mb-12 max-w-xl text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">Learning in motion</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">A workspace built to explore.</h2>
      </motion.div>
      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="border-b border-slate-200 p-7 text-center last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <p className="text-3xl font-bold text-indigo-700">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;

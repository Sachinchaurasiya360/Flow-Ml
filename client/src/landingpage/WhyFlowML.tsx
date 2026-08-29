import React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const BEFORE = [
  "Install Python, Jupyter, scikit-learn",
  "Write boilerplate data loading code",
  "Manually split train/test sets",
  "Tune hyperparameters by trial and error",
  "Parse cryptic error stack traces",
  "Build evaluation plots from scratch",
];

const AFTER = [
  "Open browser, drag a Dataset node",
  "Connect a Cleaning node in one click",
  "Train/test split is automatic",
  "Visual hyperparameter sliders",
  "Inline hints explain what went wrong",
  "Live metrics charts update as you train",
];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-6">
    {children}
  </p>
);

const WhyFlowML: React.FC = () => {
  return (
    <section id="why" className="py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="max-w-xl mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            Why Visual ML
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
            Learning ML shouldn't start with
            <br />
            <span className="text-neutral-500">setting up an environment.</span>
          </h2>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-neutral-900/50 border border-white/[0.06] rounded-xl p-8"
          >
            <SectionLabel>Traditional approach</SectionLabel>
            <ul className="space-y-3.5">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-neutral-600" />
                  </div>
                  <span className="text-sm text-neutral-500 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral-900 border border-white/[0.08] rounded-xl p-8"
          >
            <SectionLabel>With Visual ML</SectionLabel>
            <ul className="space-y-3.5">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span className="text-sm text-neutral-300 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyFlowML;

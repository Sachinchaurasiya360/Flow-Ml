import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    id: 1,
    label: "Dataset",
    desc: "Load a CSV, JSON, or connect to a database. Preview rows, check types, spot nulls.",
    detail: "iris.csv · 150 rows · 4 cols",
    color: "#6b7280",
  },
  {
    id: 2,
    label: "Cleaning",
    desc: "Remove duplicates, handle missing values, fix data types — visually, without code.",
    detail: "Drop nulls · Normalize strings",
    color: "#8b5cf6",
  },
  {
    id: 3,
    label: "Feature Eng.",
    desc: "Scale, encode, transform. Select important features. See how each step affects distributions.",
    detail: "StandardScaler · PCA optional",
    color: "#6366f1",
  },
  {
    id: 4,
    label: "Model",
    desc: "Pick an algorithm. Set hyperparameters with sliders. Train and watch the loss curve.",
    detail: "Linear Regression · 25 epochs",
    color: "#3b82f6",
  },
  {
    id: 5,
    label: "Evaluation",
    desc: "Inspect accuracy, R², confusion matrix, feature importance — all in one panel.",
    detail: "R² 0.89 · MSE 0.042",
    color: "#22c55e",
  },
  {
    id: 6,
    label: "Predict",
    desc: "Enter new values and get instant predictions. Export the model or share the pipeline.",
    detail: "Export .pkl · Share link",
    color: "#f59e0b",
  },
];

const WorkflowSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="workflow" className="py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="max-w-lg mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            Interactive workflow
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
            Every step, visible.
          </h2>
          <p className="text-base text-neutral-500 mt-4 leading-relaxed">
            A complete ML workflow in six nodes. Click any step to see what
            happens inside.
          </p>
        </motion.div>

        {/* Step row */}
        <div className="flex flex-wrap gap-2 mb-12">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === i
                    ? "bg-neutral-800 text-neutral-100 border border-white/10"
                    : "text-neutral-600 hover:text-neutral-400 border border-transparent"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: active === i ? step.color : "#374151" }}
                />
                {step.label}
              </motion.button>

              {i < STEPS.length - 1 && (
                <div className="hidden sm:flex items-center self-center">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path
                      d="M1 5h12M9 1l4 4-4 4"
                      stroke="#374151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-neutral-900 border border-white/[0.06] rounded-xl p-8 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: STEPS[active].color }}
                  />
                  <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
                    Step {STEPS[active].id} of {STEPS.length}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-100 mb-3">
                  {STEPS[active].label}
                </h3>
                <p className="text-base text-neutral-500 leading-relaxed">
                  {STEPS[active].desc}
                </p>
              </div>

              {/* Mock node */}
              <div className="flex justify-center md:justify-end">
                <div
                  className="w-56 rounded-xl border p-5 transition-all duration-300"
                  style={{
                    backgroundColor: `${STEPS[active].color}08`,
                    borderColor: `${STEPS[active].color}25`,
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: STEPS[active].color }}
                    />
                    <span className="text-sm font-semibold text-neutral-200">
                      {STEPS[active].label}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-mono">
                    {STEPS[active].detail}
                  </p>
                  <div
                    className="mt-3 h-1 rounded-full overflow-hidden bg-neutral-800"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: STEPS[active].color }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkflowSection;

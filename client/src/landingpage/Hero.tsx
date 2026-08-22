import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

const NODES = [
  {
    id: "dataset",
    label: "Dataset",
    sub: "iris.csv · 150 rows",
    dot: "#6b7280",
    status: "done",
  },
  {
    id: "features",
    label: "Feature Eng.",
    sub: "StandardScaler",
    dot: "#8b5cf6",
    status: "done",
  },
  {
    id: "model",
    label: "Linear Reg.",
    sub: "Fitting… epoch 18/25",
    dot: "#6366f1",
    status: "running",
  },
  {
    id: "eval",
    label: "Evaluate",
    sub: "R² = 0.89 · MSE 0.042",
    dot: "#22c55e",
    status: "pending",
  },
];

const PipelineViz: React.FC = () => {
  const lineRef = useRef<SVGLineElement>(null);

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Browser chrome */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-neutral-900">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-neutral-900/80">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="ml-3 text-[11px] text-neutral-600 font-mono">
            Pipeline — Linear Regression
          </span>
        </div>

        {/* Pipeline canvas */}
        <div className="p-5 space-y-1.5 bg-[#0d0d0d]">
          {NODES.map((node, i) => (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  node.status === "running"
                    ? "bg-indigo-500/[0.06] border-indigo-500/20"
                    : node.status === "done"
                      ? "bg-neutral-800/60 border-white/[0.06]"
                      : "bg-neutral-900 border-white/[0.04] opacity-50"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      node.status === "pending" ? "#374151" : node.dot,
                    boxShadow:
                      node.status === "running"
                        ? `0 0 8px ${node.dot}80`
                        : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-neutral-200 leading-none mb-0.5">
                    {node.label}
                  </p>
                  <p className="text-[10px] text-neutral-600 truncate">
                    {node.sub}
                  </p>
                </div>
                {node.status === "done" && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M2.5 6l2.5 2.5 4.5-5"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {node.status === "running" && (
                  <motion.div
                    className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent flex-shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                {i < NODES.length - 1 && (
                  <svg
                    className="absolute left-[25px] w-px overflow-visible"
                    style={{ top: `${56 + i * 52}px`, height: "52px" }}
                    aria-hidden
                  >
                    <line
                      ref={i === 0 ? lineRef : undefined}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="52"
                      stroke="#1f2937"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  </svg>
                )}
              </motion.div>

              {/* Connector line */}
              {i < NODES.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2, delay: 0.5 + i * 0.15 }}
                  className="mx-auto w-px h-3 bg-neutral-800 origin-top"
                  style={{ marginLeft: "20px" }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Metrics output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-3 p-3 rounded-lg bg-neutral-800/50 border border-white/[0.04]"
          >
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-2">
              Output metrics
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "R²", val: "0.89" },
                { key: "MSE", val: "0.042" },
                { key: "MAE", val: "0.156" },
              ].map((m) => (
                <div key={m.key} className="text-center">
                  <p className="text-[10px] text-neutral-500">{m.key}</p>
                  <p className="text-[13px] font-semibold text-neutral-200">
                    {m.val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-neutral-950 overflow-hidden flex flex-col">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #333 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <div className="relative flex-1 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center py-28 w-full">
            {/* Left — copy */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-neutral-500 border border-white/[0.08] px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Visual Machine Learning Platform
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-100 tracking-tight leading-[1.04]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Machine learning
                <br />
                <span className="text-neutral-500">you can see.</span>
              </motion.h1>

              <motion.p
                className="text-base lg:text-lg text-neutral-500 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                Build and understand ML pipelines without writing a single line
                of code. Connect nodes, run experiments, and watch algorithms
                work in real time.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 pt-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <button
                  onClick={() => navigate("/signup")}
                  className="group inline-flex items-center gap-2 bg-neutral-100 text-neutral-950 hover:bg-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  Start learning free
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a
                  href="#workflow"
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-200 border border-white/[0.08] hover:border-white/20 px-5 py-2.5 rounded-lg transition-colors"
                >
                  See how it works
                </a>
              </motion.div>

              <motion.div
                className="flex items-center gap-6 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {[
                  { value: "18+", label: "Algorithms" },
                  { value: "4k+", label: "Students" },
                  { value: "Free", label: "To start" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-sm font-semibold text-neutral-100">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-neutral-600">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — pipeline viz */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <PipelineViz />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-700" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

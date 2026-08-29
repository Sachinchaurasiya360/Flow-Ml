import React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  BarChart2,
  Database,
  Sliders,
  FlaskConical,
  Eye,
  Layers,
  BookOpen,
} from "lucide-react";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Visual Pipeline Builder",
    desc: "Connect nodes to build ML workflows. No boilerplate, just the logic.",
  },
  {
    icon: Layers,
    title: "Neural Network Playground",
    desc: "Configure layers, activations, and neurons. See forward propagation live.",
  },
  {
    icon: Eye,
    title: "Algorithm Visualizer",
    desc: "Understand decision boundaries, cluster centroids, and tree splits.",
  },
  {
    icon: BarChart2,
    title: "Live Metrics",
    desc: "Loss curves, accuracy, R², confusion matrix — updated every epoch.",
  },
  {
    icon: Database,
    title: "Dataset Explorer",
    desc: "Load CSVs, inspect distributions, and preview transformations inline.",
  },
  {
    icon: Sliders,
    title: "Feature Engineering",
    desc: "Scale, encode, reduce, and select features with visual controls.",
  },
  {
    icon: FlaskConical,
    title: "Model Comparison",
    desc: "Run multiple models side-by-side and compare their output metrics.",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    desc: "Built-in explanations walk you through what each node does and why.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-14 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Features
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
            Everything you need
            <br />
            to understand ML.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-lg hover:shadow-amber-900/5"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3C7] transition-colors group-hover:bg-[#FDE68A]">
                  <Icon className="h-4 w-4 text-[#B45309]" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

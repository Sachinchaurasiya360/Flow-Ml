import React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Zap,
  BarChart2,
  Database,
  Sliders,
  FlaskConical,
  Share2,
  Eye,
  Layers,
  History,
  Download,
  BookOpen,
} from "lucide-react";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Visual Pipeline Builder",
    desc: "Connect nodes to build ML workflows. No boilerplate, just the logic.",
  },
  {
    icon: Zap,
    title: "Real-time Execution",
    desc: "Run your pipeline and watch results appear as each node completes.",
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
    icon: History,
    title: "Experiment History",
    desc: "Every run is saved. Go back to any experiment and re-run it.",
  },
  {
    icon: Download,
    title: "Export Projects",
    desc: "Download your pipeline as Python code or a serialized model file.",
  },
  {
    icon: Share2,
    title: "Share Pipelines",
    desc: "Generate a link so anyone can view and run your pipeline in the browser.",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    desc: "Built-in explanations walk you through what each node does and why.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-neutral-950">
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
            Features
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
            Everything you need
            <br />
            to understand ML.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.04]">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="bg-neutral-950 p-7 group hover:bg-neutral-900/70 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-800/80 group-hover:bg-neutral-800 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-2">
                  {feat.title}
                </h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
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

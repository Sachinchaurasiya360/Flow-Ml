import React from "react";
import { motion } from "framer-motion";

const ALGORITHMS = [
  { name: "Linear Regression", category: "Regression", color: "#6366f1" },
  { name: "Logistic Regression", category: "Classification", color: "#8b5cf6" },
  { name: "Decision Tree", category: "Tree", color: "#06b6d4" },
  { name: "Random Forest", category: "Ensemble", color: "#0ea5e9" },
  { name: "K-Means", category: "Clustering", color: "#f59e0b" },
  { name: "SVM", category: "Classification", color: "#8b5cf6" },
  { name: "KNN", category: "Classification", color: "#6366f1" },
  { name: "Naive Bayes", category: "Probabilistic", color: "#06b6d4" },
  { name: "PCA", category: "Dim. Reduction", color: "#64748b" },
  { name: "Neural Network", category: "Deep Learning", color: "#6366f1" },
  { name: "CNN", category: "Vision", color: "#8b5cf6" },
  { name: "RNN", category: "Sequence", color: "#0ea5e9" },
  { name: "Gradient Boosting", category: "Ensemble", color: "#f59e0b" },
  { name: "AdaBoost", category: "Ensemble", color: "#f59e0b" },
  { name: "Ridge / Lasso", category: "Regularization", color: "#6366f1" },
  { name: "DBSCAN", category: "Clustering", color: "#f59e0b" },
  { name: "Image Classification", category: "Vision", color: "#8b5cf6" },
  { name: "Object Detection", category: "Vision", color: "#8b5cf6" },
];

const AlgorithmGallery: React.FC = () => {
  return (
    <section id="algorithms" className="py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-lg mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            Algorithm gallery
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
            18+ algorithms,
            <br />
            all interactive.
          </h2>
          <p className="text-base text-neutral-500 mt-4 leading-relaxed">
            Every algorithm is a node. Configure, connect, run, and observe what
            happens at each step.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2.5">
          {ALGORITHMS.map((algo, i) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              className="group flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border border-white/[0.06] rounded-lg hover:border-white/10 hover:bg-neutral-800/80 transition-all duration-200 cursor-default"
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: algo.color }}
              />
              <span className="text-sm font-medium text-neutral-300 whitespace-nowrap">
                {algo.name}
              </span>
              <span className="text-[10px] text-neutral-700 group-hover:text-neutral-500 transition-colors whitespace-nowrap">
                {algo.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmGallery;

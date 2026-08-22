import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need to know Python to use Flow ML?",
    a: "No. Flow ML is designed for visual learning. You build pipelines by connecting nodes — no code required. Once you understand the concepts, you can optionally export your pipeline as Python code.",
  },
  {
    q: "What machine learning algorithms are supported?",
    a: "Flow ML supports 18+ algorithms including Linear Regression, Logistic Regression, Decision Trees, Random Forest, KNN, SVM, K-Means, Naive Bayes, PCA, Neural Networks, CNN, and RNN — with more added regularly.",
  },
  {
    q: "Is it suitable for university coursework?",
    a: "Yes. Many professors use Flow ML in their ML and data science courses. It's particularly effective for making abstract concepts like gradient descent, decision boundaries, and neural network layers visible and understandable.",
  },
  {
    q: "Can I use my own datasets?",
    a: "Yes. You can upload CSV files directly, and the Dataset node will automatically infer column types, show distributions, and flag potential issues like missing values.",
  },
  {
    q: "Is Flow ML free?",
    a: "Flow ML is free to get started. You can build, run, and share pipelines without paying anything. Advanced features and higher compute limits are available on paid plans.",
  },
  {
    q: "Can I share my pipelines with others?",
    a: "Yes. Every pipeline can be shared via a link. Anyone with the link can view and run it in their browser — no account required.",
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-neutral-950">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            FAQ
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
            Common questions.
          </h2>
        </motion.div>

        <div className="space-y-px">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b border-white/[0.06]"
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className={`text-sm font-medium transition-colors ${open === i ? "text-neutral-100" : "text-neutral-400 group-hover:text-neutral-200"}`}
                >
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-[14px] text-neutral-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

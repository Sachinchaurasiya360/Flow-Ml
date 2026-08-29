import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is the goal of Flow ML?",
    a: "Flow ML helps students explore and implement machine learning algorithms without writing code. By connecting visual nodes, you can build a complete workflow, understand each step, and learn from the results.",
  },
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
    <section id="faq" className="border-y border-slate-200 bg-white py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-12 max-w-xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            FAQ
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
            Common questions.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Everything you need to know before starting your first workflow.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b border-slate-100 last:border-b-0"
            >
              <button
                className={`group flex w-full items-center justify-between px-5 py-5 text-left transition-colors sm:px-6 ${open === i ? "bg-slate-50" : "hover:bg-slate-50"}`}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className={`text-sm font-semibold transition-colors ${open === i ? "text-slate-900" : "text-slate-800"}`}
                >
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${open === i ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"}`}
                >
                  <ChevronDown className="h-4 w-4" />
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
                    <p className="bg-slate-50 px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6">
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

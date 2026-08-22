import React from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "Flow ML made machine learning click for me. I built and understood linear regression in one afternoon by watching the loss drop in real time — not by reading a textbook.",
    name: "Arjun Mehta",
    role: "CS Undergrad, IIT Bombay",
  },
  {
    quote:
      "I use it in my algorithms class. Students stop copying code and start actually thinking about each step. The pipeline view is worth a thousand slides.",
    name: "Dr. Priya Nair",
    role: "Associate Professor, VIT",
  },
  {
    quote:
      "Switched careers from web dev to ML. Flow ML let me build real models while still learning the theory. I landed my first ML internship four months in.",
    name: "Sam Torres",
    role: "Software Engineer → ML Intern",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-14 max-w-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
            Trusted by students
            <br />
            and educators alike.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7"
            >
              <p className="flex-1 text-[15px] leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-slate-900">
                  {t.name}
                </p>
                <p className="mt-0.5 text-[12px] text-amber-700">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

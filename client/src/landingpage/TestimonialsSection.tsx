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
    <section id="testimonials" className="py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="max-w-lg mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-600 mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight">
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
              className="bg-neutral-900 border border-white/[0.06] rounded-xl p-7 flex flex-col"
            >
              <p className="text-[15px] text-neutral-400 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6 pt-5 border-t border-white/[0.05]">
                <p className="text-sm font-semibold text-neutral-200">
                  {t.name}
                </p>
                <p className="text-[12px] text-neutral-600 mt-0.5">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

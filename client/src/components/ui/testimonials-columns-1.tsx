import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
};

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 18,
}: TestimonialsColumnProps) => (
  <div className={className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      className="flex flex-col gap-4 pb-4"
    >
      {[...Array(2)].map((_, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {testimonials.map(({ text, image, name, role }) => (
            <article key={`${groupIndex}-${name}`} className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-600">&ldquo;{text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <img src={image} alt={name} className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                  <p className="truncate text-[11px] text-amber-700">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);
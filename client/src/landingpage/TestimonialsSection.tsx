import React from "react";
import { motion } from "motion/react";
import {
  TestimonialsColumn,
  type Testimonial,
} from "../components/ui/testimonials-columns-1";

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Flow ML made machine learning click for me. I built and understood linear regression in one afternoon by watching the loss drop in real time.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=120&q=80",
    name: "Aarav Sharma",
    role: "Class 11 student, Delhi",
  },
  {
    text: "The pipeline view helps me understand what happens before the model makes a prediction. It makes ML feel less confusing.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=120&q=80",
    name: "Ananya Iyer",
    role: "Class 10 student, Chennai",
  },
  {
    text: "I made my first prediction project for school without needing to learn a lot of code first. I could see every step working.",
    image: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=120&q=80",
    name: "Vivaan Patel",
    role: "Class 9 student, Ahmedabad",
  },
  {
    text: "Our school coding club uses Flow ML to test ideas together. Everyone can follow the same workflow on the screen.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=120&q=80",
    name: "Diya Kapoor",
    role: "Class 8 student, Jaipur",
  },
  {
    text: "I liked changing the data and seeing how the result changed. It feels like doing a science experiment on my computer.",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=120&q=80",
    name: "Kabir Singh",
    role: "Class 7 student, Lucknow",
  },
  {
    text: "I finally understood why we check accuracy. The charts show exactly how my project is improving.",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=120&q=80",
    name: "Myra Reddy",
    role: "Class 10 student, Hyderabad",
  },
  {
    text: "I was nervous about machine learning, but dragging nodes and seeing the output made me want to keep trying.",
    image: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=120&q=80",
    name: "Ishaan Verma",
    role: "Class 9 student, Bengaluru",
  },
  {
    text: "The feedback after each run is my favorite part. I can make one change and understand its effect right away.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=120&q=80",
    name: "Saanvi Desai",
    role: "Class 8 student, Mumbai",
  },
  {
    text: "It gives me confidence to ask questions and try my own ideas. The whole workflow is easy to understand.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80",
    name: "Reyansh Gupta",
    role: "Class 11 student, Kolkata",
  },
];

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-12 max-w-lg text-center"
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

        <div className="mx-auto flex max-h-[620px] max-w-5xl justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:gap-6">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={23} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

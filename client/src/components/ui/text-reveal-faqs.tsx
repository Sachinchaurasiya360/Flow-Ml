import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const faqItems = [
  {
    id: "item-1",
    question: "What is Visual ML?",
    answer:
      "Visual ML is a visual machine learning workspace that provides pre-built nodes, algorithms, and layouts to help students build and understand ML pipelines without writing code.",
  },
  {
    id: "item-2",
    question: "Which platforms does Visual ML support?",
    answer:
      "Visual ML runs entirely in the browser, so it works on any modern desktop or laptop without installation. Shared and public pipelines can be viewed on mobile as well.",
  },
  {
    id: "item-3",
    question: "Can I customize a pipeline once it's built?",
    answer:
      "Yes. Every node's configuration, hyperparameters, and connections can be edited at any time, and you can re-run the pipeline to see how the results change.",
  },
  {
    id: "item-4",
    question: "Does Visual ML integrate with other tools?",
    answer:
      "Yes. Pipelines can be exported as Python code or notebooks, and shared publicly via a link so others can view and run them in their browser.",
  },
  {
    id: "item-5",
    question: "Is there documentation and support available?",
    answer:
      "Yes, Visual ML includes inline node explanations and a guided mentor. Our support team is also available to help you resolve any issues.",
  },
];

export default function FAQs() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-semibold text-slate-900">FAQs</h2>
            <p className="mt-4 text-lg text-balance text-slate-600">
              Everything you need to know about Visual ML
            </p>
            <p className="mt-6 hidden text-slate-600 md:block">
              Can&rsquo;t find what you&rsquo;re looking for? Reach out to our{" "}
              <a
                href="#"
                className="font-medium text-amber-700 hover:underline"
              >
                Visual ML support team
              </a>{" "}
              for assistance.
            </p>
          </div>

          <div className="md:col-span-3">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-slate-200"
                >
                  <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <BlurredStagger text={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-6 text-slate-600 md:hidden">
            Can&apos;t find what you&apos;re looking for? Contact our{" "}
            <a href="#" className="font-medium text-amber-700 hover:underline">
              customer support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export const BlurredStagger = ({
  text = "built by Visual ML",
}: {
  text: string;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="text-base leading-relaxed break-words whitespace-normal text-slate-600"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterAnimation}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
};

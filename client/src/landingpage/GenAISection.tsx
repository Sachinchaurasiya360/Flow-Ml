import React from "react";
import { motion } from "framer-motion";
import { Clock, Bot, Mail, Sparkles, Zap, Code2 } from "lucide-react";

const GenAISection: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: "Cron Scheduling",
      description:
        "Automate web scraping with flexible cron-based scheduling.",
    },
    {
      icon: Bot,
      title: "DynaRoute AI",
      description:
        "Use DynaRoute smart routing for intelligent analysis and helpful explanations.",
    },
    {
      icon: Mail,
      title: "Email Automation",
      description:
        "Automatically send reports, alerts, and predictions via email. Keep stakeholders informed in real-time.",
    },
    {
      icon: Sparkles,
      title: "Smart Workflows",
      description:
        "AI-powered workflow optimization and node recommendations based on your data and objectives.",
    },
    {
      icon: Zap,
      title: "Webhook Triggers",
      description:
        "Connect to external services with custom webhooks. Trigger pipelines on any event from any platform.",
    },
    {
      icon: Code2,
      title: "API Automation",
      description:
        "RESTful APIs for every pipeline. Integrate ML into your applications with simple HTTP requests.",
    },
  ];

  return (
    <section
      id="genai"
      className="relative overflow-hidden bg-[#F4F6FF] px-6 py-28 lg:px-8"
    >
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="mb-14 space-y-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">Automation suite</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            Powerful automation, built in.
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Schedule workflows, use DynaRoute AI, send automated emails, and
            connect to any platform. Production-ready automation without the
            complexity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Step number */}
                <span className="absolute right-4 top-4 text-xs font-bold text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF3C7] transition-colors group-hover:bg-[#FDE68A]">
                  <Icon className="h-6 w-6 text-[#B45309]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenAISection;

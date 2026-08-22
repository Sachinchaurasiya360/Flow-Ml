import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const flowNodes: Node[] = [
  { id: "dataset", position: { x: 20, y: 105 }, data: { label: "Dataset\niris.csv" }, style: { background: "#FFFFFF", border: "1px solid #BFDBFE", borderRadius: 14, color: "#1E3A8A", fontSize: 12, fontWeight: 700, minWidth: 130, padding: "14px 18px", boxShadow: "0 10px 24px rgba(30, 64, 175, 0.10)", whiteSpace: "pre-line" } },
  { id: "prepare", position: { x: 245, y: 55 }, data: { label: "Prepare\nScale features" }, style: { background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 14, color: "#92400E", fontSize: 12, fontWeight: 700, minWidth: 140, padding: "14px 18px", boxShadow: "0 10px 24px rgba(180, 83, 9, 0.10)", whiteSpace: "pre-line" } },
  { id: "model", position: { x: 245, y: 185 }, data: { label: "Model\nLinear regression" }, style: { background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 14, color: "#3730A3", fontSize: 12, fontWeight: 700, minWidth: 140, padding: "14px 18px", boxShadow: "0 10px 24px rgba(67, 56, 202, 0.10)", whiteSpace: "pre-line" } },
  { id: "result", position: { x: 490, y: 120 }, data: { label: "Results\nAccuracy 89%" }, style: { background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 14, color: "#065F46", fontSize: 12, fontWeight: 700, minWidth: 135, padding: "14px 18px", boxShadow: "0 10px 24px rgba(5, 150, 105, 0.10)", whiteSpace: "pre-line" } },
];

const flowEdges: Edge[] = [
  { id: "dataset-prepare", source: "dataset", target: "prepare", style: { stroke: "#CBD5E1", strokeWidth: 2 } },
  { id: "prepare-model", source: "prepare", target: "model", style: { stroke: "#CBD5E1", strokeWidth: 2 } },
  { id: "model-result", source: "model", target: "result", style: { stroke: "#CBD5E1", strokeWidth: 2 } },
];

const FlowPreview: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);
  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = () => {
    setIsRunning(true);
    setEdges((currentEdges) => currentEdges.map((edge) => ({
      ...edge,
      animated: true,
      style: { stroke: "#D97706", strokeWidth: 2.5 },
    })));
    window.setTimeout(() => {
      setIsRunning(false);
      setEdges(flowEdges);
    }, 2200);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] font-semibold text-slate-500">Flow ML — workspace</span>
        <span className="ml-auto hidden text-[10px] font-medium text-amber-700 sm:block">Drag a node to try it</span>
        <button
          type="button"
          onClick={runPipeline}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-[#D97706] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#B45309] disabled:cursor-wait disabled:opacity-70"
          disabled={isRunning}
        >
          <Play className="h-3 w-3 fill-current" />
          {isRunning ? "Running" : "Run"}
        </button>
      </div>
      <div className="h-[300px] bg-[#F8FAFC] sm:h-[390px]">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodesConnectable={false} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}>
          <Background gap={20} size={1} color="#CBD5E1" />
        </ReactFlow>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const headlineWords = ["visible.", "intuitive.", "practical.", "clear."];
  const [headlineWordIndex, setHeadlineWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeadlineWordIndex((current) => (current + 1) % headlineWords.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [headlineWords.length]);

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F6FF] px-6 pb-20 pt-24 text-center lg:px-8">
      <motion.span
        aria-hidden
        className="absolute left-[12%] top-[26%] h-3 w-3 rounded-full bg-[#FBBF24]"
        animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute bottom-[25%] right-[14%] h-5 w-5 rounded-full border border-[#FBBF24]"
        animate={{ y: [0, 20, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-[9%] top-[58%] h-14 w-14 border border-[#FBBF24]/70"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mx-auto mt-10 max-w-4xl font-serif text-5xl font-bold leading-[0.98] tracking-tight text-slate-900 sm:mt-14 sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Machine learning, made{" "}
          <span className="inline-block text-[#D97706]">
            <AnimatePresence mode="wait">
              <motion.span
                key={headlineWords[headlineWordIndex]}
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="inline-block"
              >
                {headlineWords[headlineWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
        >
          Build, run, and understand machine learning pipelines without writing code. Every connection makes the idea clearer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => navigate("/signin")}
            className="group inline-flex items-center gap-2 rounded-lg bg-[#D97706] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B45309]"
          >
            Start learning free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#workflow"
            className="inline-flex items-center gap-2 rounded-lg border border-[#FCD34D] bg-white px-5 py-3 text-sm font-semibold text-[#92400E] transition hover:bg-[#FFFBEB]"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-slate-500"
        >
          Flow ML is currently in ideation mode and available as a beta for testing and feedback. A more complete, industry-ready version is launching soon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x divide-[#FDE68A] rounded-xl border border-[#FDE68A] bg-white px-3 py-4 shadow-sm"
        >
          {[{ value: "18+", label: "Algorithms" }, { value: "4k+", label: "Students" }, { value: "Free", label: "To start" }].map((stat) => (
            <div key={stat.label} className="px-2">
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.52 }}
          className="mx-auto mt-7 max-w-5xl"
        >
          <FlowPreview />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

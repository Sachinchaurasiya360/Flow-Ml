import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChartNoAxesCombined,
  Database,
  Play,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Background,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type FlowNodeData = {
  label: string;
  detail: string;
  icon: React.ElementType;
  tone: "blue" | "amber" | "indigo" | "emerald" | "rose";
  status?: "idle" | "running" | "complete";
};

type FlowNode = Node<FlowNodeData>;

const toneStyles = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
};

const PipelineNode = ({ data }: { data: FlowNodeData }) => {
  const Icon = data.icon;
  const isRunning = data.status === "running";
  const isComplete = data.status === "complete";

  return (
    <div
      className={`relative min-w-[164px] overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all duration-300 ${
        isRunning
          ? "scale-[1.03] border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-200/70"
          : isComplete
            ? "border-emerald-300 shadow-md shadow-emerald-500/10"
            : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-0.5 ${isRunning ? "animate-pulse bg-amber-400" : isComplete ? "bg-emerald-400" : "bg-slate-100"}`} />
      <Handle type="target" position={Position.Left} className="h-2! w-2! border-2! border-white! bg-slate-400!" />
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles[data.tone]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-bold leading-tight text-slate-800">{data.label}</p>
            {isComplete && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
          </div>
          <p className="mt-0.5 truncate text-[9px] font-medium text-slate-500">{isRunning ? "Processing..." : data.detail}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="h-2! w-2! border-2! border-white! bg-slate-400!" />
    </div>
  );
};

const nodeTypes = { pipeline: PipelineNode };

const flowNodes: FlowNode[] = [
  { id: "dataset", type: "pipeline", position: { x: 0, y: 115 }, data: { label: "Customer data", detail: "12,480 rows", icon: Database, tone: "blue" } },
  { id: "prepare", type: "pipeline", position: { x: 190, y: 65 }, data: { label: "Feature prep", detail: "7 features scaled", icon: SlidersHorizontal, tone: "amber" } },
  { id: "model", type: "pipeline", position: { x: 190, y: 190 }, data: { label: "Train model", detail: "Random forest", icon: BrainCircuit, tone: "indigo" } },
  { id: "evaluate", type: "pipeline", position: { x: 385, y: 65 }, data: { label: "Evaluate", detail: "5-fold validation", icon: ChartNoAxesCombined, tone: "rose" } },
  { id: "result", type: "pipeline", position: { x: 385, y: 190 }, data: { label: "Publish model", detail: "API endpoint ready", icon: Send, tone: "emerald" } },
];

const flowEdges: Edge[] = [
  { id: "dataset-prepare", source: "dataset", target: "prepare", type: "smoothstep", style: { stroke: "#94A3B8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" } },
  { id: "prepare-model", source: "prepare", target: "model", type: "smoothstep", style: { stroke: "#94A3B8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" } },
  { id: "prepare-evaluate", source: "prepare", target: "evaluate", type: "smoothstep", style: { stroke: "#94A3B8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" } },
  { id: "model-result", source: "model", target: "result", type: "smoothstep", style: { stroke: "#94A3B8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" } },
  { id: "evaluate-result", source: "evaluate", target: "result", type: "smoothstep", style: { stroke: "#94A3B8", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#94A3B8" } },
];

const FlowPreview: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const runTimers = useRef<number[]>([]);

  const updateStage = (nodeIds: string[], status: FlowNodeData["status"]) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, status } }
          : node,
      ),
    );
  };

  useEffect(() => () => {
    runTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const runPipeline = () => {
    runTimers.current.forEach((timer) => window.clearTimeout(timer));
    setIsRunning(true);
    setHasRun(false);
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({ ...node, data: { ...node.data, status: "idle" } })),
    );
    setEdges(flowEdges);
    updateStage(["dataset"], "running");

    const scheduleStage = (delay: number, completed: string[], running: string[], activeEdges: string[]) => {
      runTimers.current.push(window.setTimeout(() => {
        updateStage(completed, "complete");
        updateStage(running, "running");
        setEdges((currentEdges) => currentEdges.map((edge) =>
          activeEdges.includes(edge.id)
            ? { ...edge, animated: true, style: { stroke: "#D97706", strokeWidth: 2.5 } }
            : edge,
        ));
      }, delay));
    };

    scheduleStage(550, ["dataset"], ["prepare"], ["dataset-prepare"]);
    scheduleStage(1100, ["prepare"], ["model", "evaluate"], ["prepare-model", "prepare-evaluate"]);
    scheduleStage(1650, ["model", "evaluate"], ["result"], ["model-result", "evaluate-result"]);
    runTimers.current.push(window.setTimeout(() => {
      updateStage(["result"], "complete");
      setIsRunning(false);
      setEdges(flowEdges);
      setHasRun(true);
    }, 2200));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] font-semibold text-slate-500">Visual ML workspace</span>
        <span className="ml-auto hidden text-[10px] font-medium text-slate-500 sm:block">v1.4 · churn-prediction</span>
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
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} nodesConnectable={false} fitView fitViewOptions={{ padding: 0.16 }} proOptions={{ hideAttribution: true }}>
          <Background gap={20} size={1} color="#CBD5E1" />
        </ReactFlow>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-4 py-2.5 sm:px-5">
        <span className={`h-2 w-2 rounded-full ${isRunning ? "animate-pulse bg-amber-500" : "bg-emerald-500"}`} />
        <span className="text-[10px] font-semibold text-slate-600">{isRunning ? "Pipeline running" : hasRun ? "Run completed" : "Ready to run"}</span>
        <span className="ml-auto text-[10px] font-medium text-slate-400">5 nodes · 5 connections</span>
        {hasRun && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> 91.4% accuracy</span>}
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
          Visual ML is currently in ideation mode and available as a beta for testing and feedback. A more complete, industry-ready version is launching soon.
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

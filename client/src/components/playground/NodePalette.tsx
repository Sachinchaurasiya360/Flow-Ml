/**
 * Node Palette - Draggable nodes + pipeline templates for the builder
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Layers,
  Play,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import { getAllNodes } from "../../config/nodeDefinitions";
import { PIPELINE_TEMPLATES } from "../../config/pipelineTemplates";
import type { PipelineTemplate } from "../../config/pipelineTemplates";
import { usePlaygroundStore } from "../../store/playgroundStore";

type Tab = "nodes" | "templates";

const CATEGORY_LABELS: Record<string, string> = {
  regression: "Regression",
  classification: "Classification",
  genai: "GenAI",
};

const NodePalette = () => {
  const [activeTab, setActiveTab] = useState<Tab>("nodes");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["data-sources", "preprocessing", "ml-algorithms"]),
  );

  const { nodes, setNodes, setEdges, clearCanvas } = usePlaygroundStore();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleLoadTemplate = (template: PipelineTemplate) => {
    if (
      nodes.length > 0 &&
      !window.confirm(
        "Loading a template will replace the current canvas. Continue?",
      )
    ) {
      return;
    }

    const { nodes: tplNodes, edges: tplEdges } = template.buildTemplate();
    clearCanvas();
    // Small timeout so clearCanvas state flushes before we set new state
    setTimeout(() => {
      setNodes(tplNodes);
      setEdges(tplEdges);
    }, 0);
  };

  // Get all nodes and organize by category
  const allNodes = getAllNodes();

  const categories = [
    { id: "data-sources", label: "Data Sources", icon: "📁" },
    { id: "view", label: "View Data", icon: "👁️" },
    { id: "preprocessing", label: "Preprocess", icon: "🧹" },
    { id: "feature-engineering", label: "Feature Engineering", icon: "⚙️" },
    { id: "target-split", label: "Target & Split", icon: "🎯" },
    { id: "ml-algorithms", label: "Model Training", icon: "🤖" },
    { id: "result", label: "Results & Metrics", icon: "📊" },
    { id: "genai", label: "GenAI", icon: "✨" },
  ];

  return (
    <div className="w-72 bg-linear-to-b from-slate-50/95 to-white/95 backdrop-blur-xl border-r border-slate-200/60 overflow-y-auto shadow-xl flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-linear-to-br from-slate-900 to-slate-700 px-4 pt-4 pb-3 shadow-lg shadow-slate-900/25">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Node Palette</h2>
            <p className="text-xs text-slate-300">
              {activeTab === "nodes"
                ? "Drag nodes to build your pipeline"
                : "Load a pre-built pipeline"}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white/10 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("nodes")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "nodes"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Nodes
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "templates"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Templates
          </button>
        </div>
      </div>

      {/* ── Nodes Tab ──────────────────────────────────────── */}
      {activeTab === "nodes" && (
        <div className="p-4 space-y-3 flex-1">
          {categories.map((category) => {
            const catNodes = allNodes.filter(
              (node) => node.category === category.id,
            );
            if (catNodes.length === 0) return null;

            const isExpanded = expandedCategories.has(category.id);

            return (
              <div key={category.id} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/80 hover:bg-white border border-slate-200/60 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                      {category.label}
                    </span>
                    <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {catNodes.length}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                  </motion.div>
                </button>

                {/* Category Nodes */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pl-2">
                        {catNodes.map((node, index) => (
                          <motion.div
                            key={node.type}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.05,
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="group"
                          >
                            <div
                              draggable
                              onDragStart={(e) => onDragStart(e, node.type)}
                              className="relative p-3 bg-white rounded-xl border cursor-grab active:cursor-grabbing transition-all overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_20px_-6px_var(--node-glow)]"
                              style={
                                {
                                  "--node-glow": `${node.color}45`,
                                  borderColor: `${node.color}30`,
                                } as React.CSSProperties
                              }
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${node.color}70`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = `${node.color}30`;
                              }}
                            >
                              {/* Subtle tinted wash on hover */}
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{
                                  background: `linear-gradient(135deg, ${node.color}0c, transparent 60%)`,
                                }}
                              />

                              <div className="relative flex items-start gap-3">
                                {/* Icon */}
                                <div
                                  className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 transition-transform duration-200 group-hover:scale-105"
                                  style={{
                                    backgroundColor: `${node.color}18`,
                                    boxShadow: `inset 0 0 0 1px ${node.color}25`,
                                  }}
                                >
                                  {typeof node.icon === "string" ? (
                                    <span className="text-lg">
                                      {node.icon}
                                    </span>
                                  ) : (
                                    <node.icon
                                      className="w-5 h-5"
                                      style={{ color: node.color }}
                                    />
                                  )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                                      {node.label}
                                    </span>
                                    <span
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: node.color }}
                                    />
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                    {node.description}
                                  </div>
                                </div>

                                {/* Drag handle */}
                                <GripVertical className="w-4 h-4 text-slate-300 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Templates Tab ──────────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="p-4 space-y-3 flex-1">
          {(["regression", "classification", "genai"] as const).map(
            (cat) => {
              const templates = PIPELINE_TEMPLATES.filter(
                (t) => t.category === cat,
              );
              if (templates.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  {/* Category label */}
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {CATEGORY_LABELS[cat]}
                  </p>

                  {templates.map((tpl, index) => (
                    <TemplateCard
                      key={tpl.id}
                      template={tpl}
                      index={index}
                      onLoad={handleLoadTemplate}
                    />
                  ))}
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Bottom Tip */}
      <div className="sticky bottom-0 p-4 bg-linear-to-t from-white via-white to-transparent">
        <div className="p-3 bg-linear-to-br from-slate-900 to-slate-700 rounded-xl border border-slate-800 shadow-lg shadow-slate-900/25">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-white font-semibold">Quick Tip:</strong>{" "}
              {activeTab === "nodes"
                ? "Drag and drop nodes onto the canvas to start building your ML pipeline"
                : "Click a template to load a ready-made pipeline onto your canvas"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Template Card ───────────────────────────────────────────────

interface TemplateCardProps {
  template: PipelineTemplate;
  index: number;
  onLoad: (tpl: PipelineTemplate) => void;
}

const TemplateCard = ({ template, index, onLoad }: TemplateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.06 }}
      className="group relative bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all"
        style={{ backgroundColor: template.color }}
      />

      <div className="p-3.5 pl-4">
        {/* Top: emoji + name + node count */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-lg leading-none">{template.emoji}</span>
          <span className="text-sm font-bold text-slate-900 flex-1">
            {template.name}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {template.nodeCount} nodes
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2.5">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] font-medium rounded-full border"
              style={{
                color: template.color,
                borderColor: `${template.color}30`,
                backgroundColor: `${template.color}08`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Load button */}
        <button
          onClick={() => onLoad(template)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: template.color }}
        >
          Load Template
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default NodePalette;

/**
 * PublicAppView — Renders a published custom app for end users.
 * No authentication. Collects input, executes pipeline, shows animated results.
 *
 * Execution phases:
 *   idle      → blocks render normally, results area shows placeholder
 *   executing → animated ExecutionTimeline replaces results area
 *   done      → staggered reveal of interactive node explorer cards
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Sparkles, Zap } from "lucide-react";
import { useExecutePublicApp } from "../hooks/usePublicApp";
import BlockRenderer from "./BlockRenderer";
import type { PublicApp, AppTheme, ExecuteAppResponse } from "../types/appBuilder";

interface PublicAppViewProps {
  app: PublicApp;
  slug: string;
}

// Stagger container for block entrance
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function PublicAppView({ app, slug }: PublicAppViewProps) {
  const executeMutation = useExecutePublicApp(slug);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileNodeId, setFileNodeId] = useState<string | null>(null);
  const [nodeInputs, setNodeInputs] = useState<Record<string, Record<string, unknown>>>({});
  const [results, setResults] = useState<ExecuteAppResponse | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);

  const handleFieldChange = (
    name: string,
    value: unknown,
    nodeId?: string,
    nodeConfigKey?: string,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (nodeId && nodeConfigKey) {
      setNodeInputs((prev) => ({
        ...prev,
        [nodeId]: { ...(prev[nodeId] || {}), [nodeConfigKey]: value },
      }));
    }
  };

  const handleFileUpload = (base64: string, filename: string, nodeId?: string) => {
    setFileData(base64);
    setFormData((prev) => ({ ...prev, filename }));
    if (nodeId) setFileNodeId(nodeId);
  };

  const handleSubmit = async () => {
    try {
      setHasExecuted(true);
      const hasNodeInputs = Object.keys(nodeInputs).length > 0;
      const res = await executeMutation.mutateAsync({
        input_data: formData,
        file_data: fileData ?? undefined,
        node_inputs: hasNodeInputs ? nodeInputs : undefined,
        file_node_id: fileNodeId ?? undefined,
      });
      setResults(res);
      if (!res.success) {
        toast.error(res.error ?? "Execution failed");
      }
    } catch {
      toast.error("Failed to execute pipeline");
    }
  };

  const theme: AppTheme = app.theme ?? {
    primaryColor: "#6366f1",
    fontFamily: "Inter",
    darkMode: false,
  };

  const isExecuting = executeMutation.isPending;

  return (
    <div
      className={`min-h-screen ${theme.darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Decorative top bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.primaryColor}80, ${theme.primaryColor})`,
        }}
      />

      {/* App header */}
      <div
        className="border-b"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}10, transparent)`,
          borderColor: `${theme.primaryColor}20`,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${theme.primaryColor}20` }}
          >
            <Sparkles className="h-4 w-4" style={{ color: theme.primaryColor }} />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={`text-base font-bold ${theme.darkMode ? "text-white" : "text-gray-900"}`}
            >
              {app.name}
            </motion.h1>
            {app.description && (
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="text-xs text-gray-500"
              >
                {app.description}
              </motion.p>
            )}
          </div>
          {hasExecuted && !isExecuting && results?.success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full"
            >
              <Zap className="h-3 w-3" />
              Results ready
            </motion.div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {app.blocks.map((block) => (
            <motion.div key={block.id} variants={blockVariants}>
              <BlockRenderer
                block={block}
                mode="live"
                theme={theme}
                formData={formData}
                results={results}
                isExecuting={isExecuting}
                onFieldChange={handleFieldChange}
                onFileUpload={handleFileUpload}
                onSubmit={handleSubmit}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state — no blocks configured */}
        {app.blocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${theme.primaryColor}15` }}
            >
              <Sparkles className="h-8 w-8" style={{ color: theme.primaryColor }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">App in Progress</h2>
            <p className="text-sm text-gray-400">This app hasn't been configured with any blocks yet.</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <AnimatePresence>
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8 border-t mt-12"
          style={{ borderColor: `${theme.primaryColor}15` }}
        >
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${theme.primaryColor}20` }}
            >
              <Sparkles className="h-3 w-3" style={{ color: theme.primaryColor }} />
            </div>
            <p className={`text-xs ${theme.darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Built by <span className="font-medium text-gray-600">{app.owner_name}</span>
              {" "}&middot;{" "}
              <span style={{ color: theme.primaryColor }}>Powered by Flow ML</span>
            </p>
          </div>
        </motion.footer>
      </AnimatePresence>
    </div>
  );
}

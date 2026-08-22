import {
  Sparkles,
  Bot,
  MessageSquare,
  FileText,
  CheckCircle2,
  Thermometer,
  Hash,
  Trash2,
  Plus,
  type LucideIcon,
} from "lucide-react";

interface GenAIConfigPanelProps {
  nodeType: string;
  config: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
  connectedSourceNode?: { data: { label: string } } | null;
}

const NODE_THEMES: Record<
  string,
  {
    label: string;
    description: string;
    color: string;
    bgFrom: string;
    bgTo: string;
    borderColor: string;
    icon: LucideIcon;
    accentToggle: string;
    accentBorder: string;
    accentSelectedBg: string;
    accentText: string;
    accentRing: string;
  }
> = {
  llm_node: {
    label: "LLM Provider",
    description: "Configure AI model provider and parameters",
    color: "#8B5CF6",
    bgFrom: "from-violet-50",
    bgTo: "to-purple-50",
    borderColor: "border-violet-100",
    icon: Bot,
    accentToggle: "bg-violet-500",
    accentBorder: "border-violet-500",
    accentSelectedBg: "bg-violet-50",
    accentText: "text-violet-700",
    accentRing: "focus:ring-violet-500 focus:border-violet-500",
  },
  system_prompt: {
    label: "System Prompt",
    description: "Set AI role and behavior instructions",
    color: "#6366F1",
    bgFrom: "from-indigo-50",
    bgTo: "to-blue-50",
    borderColor: "border-indigo-100",
    icon: MessageSquare,
    accentToggle: "bg-indigo-500",
    accentBorder: "border-indigo-500",
    accentSelectedBg: "bg-indigo-50",
    accentText: "text-indigo-700",
    accentRing: "focus:ring-indigo-500 focus:border-indigo-500",
  },
  chatbot_node: {
    label: "Chatbot",
    description: "Chat interface for sending and receiving messages",
    color: "#10B981",
    bgFrom: "from-emerald-50",
    bgTo: "to-green-50",
    borderColor: "border-emerald-100",
    icon: MessageSquare,
    accentToggle: "bg-emerald-500",
    accentBorder: "border-emerald-500",
    accentSelectedBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    accentRing: "focus:ring-emerald-500 focus:border-emerald-500",
  },
  example_node: {
    label: "Examples (Few-Shot)",
    description: "Add input/output examples for few-shot learning",
    color: "#F59E0B",
    bgFrom: "from-amber-50",
    bgTo: "to-yellow-50",
    borderColor: "border-amber-100",
    icon: FileText,
    accentToggle: "bg-amber-500",
    accentBorder: "border-amber-500",
    accentSelectedBg: "bg-amber-50",
    accentText: "text-amber-700",
    accentRing: "focus:ring-amber-500 focus:border-amber-500",
  },
};

// Role presets for System Prompt node
const ROLE_PRESETS = [
  {
    value: "helpful_assistant",
    label: "Helpful Assistant",
    icon: "💬",
    desc: "General-purpose assistant",
  },
  {
    value: "domain_expert",
    label: "Domain Expert",
    icon: "🎓",
    desc: "Subject matter specialist",
  },
  {
    value: "tutor",
    label: "Tutor",
    icon: "📚",
    desc: "Patient teacher",
  },
  {
    value: "code_reviewer",
    label: "Code Reviewer",
    icon: "💻",
    desc: "Code quality analyst",
  },
  {
    value: "creative_writer",
    label: "Creative Writer",
    icon: "✍️",
    desc: "Creative content creator",
  },
  {
    value: "data_analyst",
    label: "Data Analyst",
    icon: "📊",
    desc: "Data insights specialist",
  },
  {
    value: "technical_writer",
    label: "Technical Writer",
    icon: "📝",
    desc: "Technical documentation",
  },
  {
    value: "problem_solver",
    label: "Problem Solver",
    icon: "🧩",
    desc: "Analytical thinker",
  },
  {
    value: "research_assistant",
    label: "Research Assistant",
    icon: "🔬",
    desc: "Research support",
  },
  {
    value: "custom",
    label: "Custom Role",
    icon: "⚙️",
    desc: "Define your own",
  },
];

export function GenAIConfigPanel({
  nodeType,
  config,
  onFieldChange,
  connectedSourceNode,
}: GenAIConfigPanelProps) {
  const theme = NODE_THEMES[nodeType] || NODE_THEMES.llm_node;
  const NodeIcon = theme.icon;
  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className={`bg-linear-to-br ${theme.bgFrom} ${theme.bgTo} rounded-xl p-4 border ${theme.borderColor}`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: theme.color }}
          >
            <NodeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{theme.label}</h3>
            <p className="text-xs text-slate-500">{theme.description}</p>
          </div>
          <Sparkles
            className="w-4 h-4 ml-auto opacity-40"
            style={{ color: theme.color }}
          />
        </div>
      </div>

      {/* Connection Status (for nodes that need upstream) */}
      {(nodeType === "system_prompt" || nodeType === "chatbot_node" || nodeType === "example_node") && (
        <div
          className={`rounded-xl p-3.5 border ${connectedSourceNode ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
        >
          <div className="flex items-center gap-2.5">
            {connectedSourceNode ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
            ) : (
              <div className="w-4.5 h-4.5 rounded-full border-2 border-amber-400" />
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wider ${connectedSourceNode ? "text-green-800" : "text-amber-800"}`}
            >
              {connectedSourceNode ? "Node Connected" : "Not Connected"}
            </span>
          </div>
          <p
            className={`text-xs mt-1 ${connectedSourceNode ? "text-green-700" : "text-amber-700"}`}
          >
            {connectedSourceNode
              ? `Connected to: ${connectedSourceNode.data.label}`
              : nodeType === "system_prompt"
                ? "Connect an LLM Provider node"
                : nodeType === "chatbot_node"
                  ? "Connect to a System Prompt or LLM Provider node"
                  : "Connect to a System Prompt node"}
          </p>
        </div>
      )}

      {/* ==================== LLM NODE ==================== */}
      {nodeType === "llm_node" && (
        <>
          {/* DynaRoute provider */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">
              AI Provider
            </p>
            <div className="flex items-center gap-3 rounded-lg border-2 border-violet-500 bg-violet-50 p-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br from-violet-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-violet-700">DynaRoute</span>
                <span className="text-[10px] text-slate-500">Server-managed smart routing</span>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-slate-700">
                Temperature
              </span>
              <span className="ml-auto text-sm font-bold text-violet-700">
                {(config.temperature as number) ?? 0.7}
              </span>
            </div>
            <input
              type="range"
              value={(config.temperature as number) ?? 0.7}
              onChange={(e) =>
                onFieldChange("temperature", parseFloat(e.target.value))
              }
              min={0}
              max={2}
              step={0.1}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(((config.temperature as number) ?? 0.7) / 2) * 100}%, #E2E8F0 ${(((config.temperature as number) ?? 0.7) / 2) * 100}%, #E2E8F0 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Focused (0)</span>
              <span>Balanced (1)</span>
              <span>Creative (2)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-slate-700">
                Max Tokens
              </span>
              <span className="ml-auto text-sm font-bold text-violet-700">
                {(config.maxTokens as number) ?? 1000}
              </span>
            </div>
            <input
              type="range"
              value={(config.maxTokens as number) ?? 1000}
              onChange={(e) =>
                onFieldChange("maxTokens", parseInt(e.target.value))
              }
              min={1}
              max={4000}
              step={100}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(((config.maxTokens as number) ?? 1000) / 4000) * 100}%, #E2E8F0 ${(((config.maxTokens as number) ?? 1000) / 4000) * 100}%, #E2E8F0 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1</span>
              <span>2000</span>
              <span>4000</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Maximum length of the AI response
            </p>
          </div>

          {/* Provider Info */}
          <div className="rounded-xl p-3.5 border border-violet-200 bg-violet-50/50">
              <p className="text-xs font-semibold text-violet-800">
                DynaRoute Auto-Routing
              </p>
              <p className="text-[11px] text-violet-600 mt-1">
                Automatically routes requests to the best available model for
                optimal results.
              </p>
          </div>
        </>
      )}

      {/* ==================== SYSTEM PROMPT NODE ==================== */}
      {nodeType === "system_prompt" && (
        <>
          {/* Role Selector */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">
              AI Role Preset
            </p>
            <div className="grid grid-cols-2 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
              {ROLE_PRESETS.map((role) => (
                <button
                  key={role.value}
                  onClick={() => onFieldChange("role", role.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all duration-150 text-left ${
                    (config.role || "helpful_assistant") === role.value
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{role.icon}</span>
                  <div className="min-w-0">
                    <span
                      className={`text-[11px] font-semibold block truncate ${(config.role || "helpful_assistant") === role.value ? "text-indigo-700" : "text-slate-600"}`}
                    >
                      {role.label}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {role.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Role (conditional) */}
          {config.role === "custom" && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <label className="text-xs font-medium text-indigo-700 block mb-2">
                Custom Role Description
              </label>
              <input
                type="text"
                value={(config.customRole as string) || ""}
                onChange={(e) => onFieldChange("customRole", e.target.value)}
                placeholder="e.g., an expert Python developer"
                className="w-full px-3 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* System Prompt Instructions */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700">
                Instructions
              </span>
              <span className="text-red-400 text-xs">*</span>
            </div>
            <textarea
              value={(config.systemPrompt as string) || ""}
              onChange={(e) => onFieldChange("systemPrompt", e.target.value)}
              rows={6}
              placeholder="Enter specific instructions for the AI's behavior..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-slate-400">
                Detailed instructions that guide the AI's responses
              </p>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {((config.systemPrompt as string) || "").length} chars
              </span>
            </div>
          </div>
        </>
      )}

      {/* ==================== CHATBOT NODE ==================== */}
      {nodeType === "chatbot_node" && (
        <>
          {/* Session Settings */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Session Settings
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-600">
                Session ID
              </span>
            </div>
            <input
              type="text"
              value={(config.sessionId as string) || "default"}
              onChange={(e) => onFieldChange("sessionId", e.target.value)}
              placeholder="default"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Unique identifier for this conversation
            </p>
          </div>

          {/* Max History Slider */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700">
                Max History
              </span>
              <span className="ml-auto text-sm font-bold text-emerald-700">
                {(config.maxHistory as number) ?? 20}
              </span>
            </div>
            <input
              type="range"
              value={(config.maxHistory as number) ?? 20}
              onChange={(e) =>
                onFieldChange("maxHistory", parseInt(e.target.value))
              }
              min={2}
              max={50}
              step={2}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${(((config.maxHistory as number) ?? 20) / 50) * 100}%, #E2E8F0 ${(((config.maxHistory as number) ?? 20) / 50) * 100}%, #E2E8F0 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2</span>
              <span>25</span>
              <span>50</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Maximum messages to keep in conversation history
            </p>
          </div>

          {/* Clear on Run Toggle */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 block">
                    Clear on Run
                  </span>
                  <span className="text-xs text-slate-400">
                    Reset history each pipeline run
                  </span>
                </div>
              </div>
              <button
                onClick={() => onFieldChange("clearOnRun", !config.clearOnRun)}
                className={`w-10 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                  config.clearOnRun ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    config.clearOnRun ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700">
                Chat Preview
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2.5 border border-slate-100">
              <div className="flex justify-end">
                <div className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg rounded-br-sm max-w-[75%]">
                  Hello! How can you help me?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg rounded-bl-sm max-w-[75%] border border-slate-200">
                  I'm your AI assistant. Ask me anything!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg rounded-br-sm max-w-[75%]">
                  What's machine learning?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg rounded-bl-sm border border-slate-200 flex items-center gap-1.5 py-2.5 px-4">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-xl p-4 border border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800">
                How It Works
              </span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-emerald-700">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                Connect an LLM Provider and optionally a System Prompt node
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                Run the pipeline to open the chat interface
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                Messages are sent to the AI and responses appear in real-time
              </li>
            </ul>
          </div>

          {/* Ready Status */}
          <div
            className={`rounded-xl p-3.5 border ${
              connectedSourceNode
                ? "bg-green-50 border-green-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  connectedSourceNode ? "text-green-600" : "text-slate-400"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  connectedSourceNode ? "text-green-800" : "text-slate-500"
                }`}
              >
                {connectedSourceNode
                  ? "Ready to chat"
                  : "Connect an LLM Provider to get started"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* ==================== EXAMPLE NODE (Few-Shot) ==================== */}
      {nodeType === "example_node" && (
        <>
          {/* Examples List */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-700">
                  Examples
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {((config.examples as Array<{ userInput: string; expectedOutput: string }>) || []).length} example
                {((config.examples as Array<{ userInput: string; expectedOutput: string }>) || []).length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {(
                (config.examples as Array<{
                  userInput: string;
                  expectedOutput: string;
                }>) || []
              ).map(
                (
                  example: { userInput: string; expectedOutput: string },
                  index: number,
                ) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Example {index + 1}
                      </span>
                      <button
                        onClick={() => {
                          const examples = [
                            ...((config.examples as Array<{
                              userInput: string;
                              expectedOutput: string;
                            }>) || []),
                          ];
                          examples.splice(index, 1);
                          onFieldChange("examples", examples);
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-medium text-slate-500 block mb-1">
                        User Input
                      </label>
                      <textarea
                        value={example.userInput || ""}
                        onChange={(e) => {
                          const examples = [
                            ...((config.examples as Array<{
                              userInput: string;
                              expectedOutput: string;
                            }>) || []),
                          ];
                          examples[index] = {
                            ...examples[index],
                            userInput: e.target.value,
                          };
                          onFieldChange("examples", examples);
                        }}
                        rows={2}
                        placeholder="Enter user input example..."
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-medium text-slate-500 block mb-1">
                        Expected Output
                      </label>
                      <textarea
                        value={example.expectedOutput || ""}
                        onChange={(e) => {
                          const examples = [
                            ...((config.examples as Array<{
                              userInput: string;
                              expectedOutput: string;
                            }>) || []),
                          ];
                          examples[index] = {
                            ...examples[index],
                            expectedOutput: e.target.value,
                          };
                          onFieldChange("examples", examples);
                        }}
                        rows={2}
                        placeholder="Enter expected output..."
                        className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Add Example Button */}
            <button
              onClick={() => {
                const examples = [
                  ...((config.examples as Array<{
                    userInput: string;
                    expectedOutput: string;
                  }>) || []),
                  { userInput: "", expectedOutput: "" },
                ];
                onFieldChange("examples", examples);
              }}
              className="w-full mt-3 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Example
            </button>
          </div>

          {/* Tip */}
          <div className="rounded-xl p-3.5 border border-amber-200 bg-amber-50/50">
            <p className="text-xs font-semibold text-amber-800">
              Few-Shot Learning
            </p>
            <p className="text-[11px] text-amber-600 mt-1">
              Adding examples helps the AI understand the desired input/output
              format and improves response quality.
            </p>
          </div>
        </>
      )}

      {/* Ready Status */}
      {nodeType === "llm_node" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-green-800">Ready to use DynaRoute</span>
          </div>
        </div>
      )}

      {nodeType === "system_prompt" && (
        <div
          className={`rounded-xl p-3.5 border ${
            (config.systemPrompt as string)
              ? "bg-green-50 border-green-200"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${(config.systemPrompt as string) ? "text-green-600" : "text-slate-400"}`}
            />
            <span
              className={`text-xs font-semibold ${(config.systemPrompt as string) ? "text-green-800" : "text-slate-500"}`}
            >
              {(config.systemPrompt as string)
                ? "Prompt configured"
                : "Add instructions to continue"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

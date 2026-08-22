import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, AlertTriangle, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePlaygroundStore } from "../../store/playgroundStore";
import { env } from "../../lib/env";

interface ChatbotModalProps {
  nodeId: string | null;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export const ChatbotModal = ({ nodeId, onClose }: ChatbotModalProps) => {
  const { getNodeById, edges } = usePlaygroundStore();
  const node = nodeId ? getNodeById(nodeId) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get connected LLM Provider node
  const getConnectedLLMNode = () => {
    if (!nodeId) return null;
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);
    const llmEdge = incomingEdges.find((edge) => {
      const sourceNode = getNodeById(edge.source);
      return sourceNode?.type === "llm_node";
    });
    if (!llmEdge) return null;
    return getNodeById(llmEdge.source);
  };

  // Get connected System Prompt node
  const getConnectedSystemPromptNode = () => {
    if (!nodeId) return null;
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);
    const systemPromptEdge = incomingEdges.find((edge) => {
      const sourceNode = getNodeById(edge.source);
      return sourceNode?.type === "system_prompt";
    });
    if (!systemPromptEdge) return null;
    return getNodeById(systemPromptEdge.source);
  };

  // Get connected Example node
  const getConnectedExampleNode = () => {
    if (!nodeId) return null;
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);
    const exampleEdge = incomingEdges.find((edge) => {
      const sourceNode = getNodeById(edge.source);
      return sourceNode?.type === "example_node";
    });
    if (!exampleEdge) return null;
    return getNodeById(exampleEdge.source);
  };

  // Build system prompt from connected node
  const buildSystemPrompt = () => {
    const systemPromptNode = getConnectedSystemPromptNode();
    if (!systemPromptNode) return null;

    const config = systemPromptNode.data?.config;
    if (!config) return null;

    const role = config.role;
    const customRole = config.customRole || "";
    const instructions = config.systemPrompt || "";

    // Role templates
    const roleTemplates: Record<string, string> = {
      helpful_assistant: "You are a helpful assistant.",
      domain_expert: "You are a domain expert with deep knowledge.",
      tutor: "You are a patient and encouraging tutor.",
      code_reviewer: "You are an experienced code reviewer.",
      creative_writer:
        "You are a creative writer with excellent storytelling skills.",
      data_analyst: "You are a data analyst skilled in interpreting data.",
      technical_writer:
        "You are a technical writer who explains complex topics clearly.",
      problem_solver: "You are a problem solver who thinks step-by-step.",
      research_assistant:
        "You are a research assistant who provides accurate information.",
      custom: customRole,
    };

    const roleText = roleTemplates[role] || roleTemplates.helpful_assistant;
    return `${roleText}\n\n${instructions}`.trim();
  };

  const llmNode = getConnectedLLMNode();
  const hasLLMConnection = !!llmNode;
  const provider = "DynaRoute";
  const systemPrompt = buildSystemPrompt();

  // Get examples from connected node
  const getExamples = () => {
    const exampleNode = getConnectedExampleNode();
    if (!exampleNode) return null;

    const config = exampleNode.data?.config;
    if (!config || !config.examples) return null;

    // Filter out empty examples
    const validExamples = config.examples.filter(
      (ex: any) => ex.userInput?.trim() && ex.expectedOutput?.trim(),
    );

    return validExamples.length > 0 ? validExamples : null;
  };

  const examples = getExamples();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Early return AFTER ALL hooks
  if (!nodeId || !node) return null;

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !hasLLMConnection) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Create a placeholder message for streaming
      const assistantMessageId = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      // Use streaming endpoint
      const response = await fetch(`${env.API_URL}/genai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          message: currentMessage,
          ...(systemPrompt && { systemPrompt: systemPrompt }), // Include system prompt if connected
          ...(examples && { examples: examples }), // Include examples if connected
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.content) {
              accumulatedContent += data.content;
              // Update the last message with accumulated content
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: accumulatedContent,
                  timestamp: new Date(),
                };
                return newMessages;
              });
            }

            if (data.done) {
              break;
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
          timestamp: new Date(),
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b border-gray-700 flex items-center justify-between"
            style={{ borderTopColor: "#10B981", borderTopWidth: "3px" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#10B98120" }}
              >
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: "#10B981" }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Chatbot - {node.data.label}
                </h3>
                <p className="text-sm text-gray-400">
                  Session: {node.data.config?.sessionId || "default"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                  title="Clear chat history"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Warning if not connected to LLM */}
          {!hasLLMConnection && (
            <div className="mx-6 mt-4 p-4 bg-amber-900/20 border border-amber-700 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Not Connected to LLM Provider
                </p>
                <p className="text-xs text-amber-300 mt-1">
                  Please connect an LLM Provider node to this Chatbot node to
                  enable chat functionality.
                </p>
              </div>
            </div>
          )}

          {/* Provider Info */}
          {hasLLMConnection && (
            <div className="mx-6 mt-4 px-4 py-2 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-xs text-blue-300">
                Using provider:{" "}
                <span className="font-semibold">{provider}</span>
              </p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">
                    {!hasLLMConnection
                      ? "Connect an LLM Provider node first"
                    : "Start a conversation by typing a message below"}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!hasLLMConnection || isLoading}
                placeholder={
                  !hasLLMConnection
                    ? "Connect an LLM Provider node first..."
                    : "Type your message... (Press Enter to send, Shift+Enter for new line)"
                }
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  !hasLLMConnection ||
                  isLoading ||
                  !inputMessage.trim()
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

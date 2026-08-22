/**
 * GenAI Node Definitions
 */

import type { NodeCategory } from "./nodeDefinitions";
import { Sparkles, Bot, MessageSquare, FileText } from "lucide-react";

export const genaiCategory: NodeCategory = {
  id: "genai",
  label: "GenAI",
  icon: Sparkles,
  nodes: [
    {
      type: "llm_node",
      label: "LLM Provider",
      description: "Configure DynaRoute model routing and parameters",
      category: "genai",
      icon: Bot,
      color: "#8B5CF6",
      defaultConfig: {
        provider: "dynaroute",
        model: "auto", // Set by backend based on provider
        temperature: 0.7,
        maxTokens: 1000,
      },
      configFields: [
        {
          name: "temperature",
          label: "Temperature",
          type: "number",
          min: 0,
          max: 2,
          step: 0.1,
          defaultValue: 0.7,
          description: "Controls randomness (0=focused, 2=creative)",
        },
        {
          name: "maxTokens",
          label: "Max Tokens",
          type: "number",
          min: 1,
          max: 4000,
          defaultValue: 1000,
        },
      ],
    },
    {
      type: "system_prompt",
      label: "System Prompt",
      description: "Set AI role and behavior with presets",
      category: "genai",
      icon: MessageSquare,
      color: "#6366F1",
      defaultConfig: {
        role: "helpful_assistant",
        customRole: "",
        systemPrompt: "",
      },
      configFields: [
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { value: "helpful_assistant", label: "Helpful Assistant" },
            { value: "domain_expert", label: "Domain Expert" },
            { value: "tutor", label: "Tutor" },
            { value: "code_reviewer", label: "Code Reviewer" },
            { value: "creative_writer", label: "Creative Writer" },
            { value: "data_analyst", label: "Data Analyst" },
            { value: "technical_writer", label: "Technical Writer" },
            { value: "problem_solver", label: "Problem Solver" },
            { value: "research_assistant", label: "Research Assistant" },
            { value: "custom", label: "Custom Role" },
          ],
          defaultValue: "helpful_assistant",
          required: true,
        },
        {
          name: "customRole",
          label: "Custom Role Description",
          type: "text",
          placeholder: "e.g., an expert Python developer",
          conditionalDisplay: { field: "role", equals: "custom" },
          description: "Describe the custom role",
        },
        {
          name: "systemPrompt",
          label: "Instructions",
          type: "textarea",
          placeholder: "Enter specific instructions for the AI...",
          required: true,
          description: "Detailed instructions for the AI's behavior",
        },
      ],
    },
    {
      type: "chatbot_node",
      label: "Chatbot",
      description: "Chat interface - send and receive messages",
      category: "genai",
      icon: MessageSquare,
      color: "#10B981",
      defaultConfig: {
        sessionId: "default",
        maxHistory: 20,
        clearOnRun: false,
      },
      configFields: [
        {
          name: "sessionId",
          label: "Session ID",
          type: "text",
          defaultValue: "default",
          description: "Unique identifier for this conversation",
          placeholder: "default",
        },
        {
          name: "maxHistory",
          label: "Max History",
          type: "number",
          min: 2,
          max: 50,
          step: 2,
          defaultValue: 20,
          description: "Maximum messages to keep in conversation history",
        },
        {
          name: "clearOnRun",
          label: "Clear on Run",
          type: "checkbox",
          defaultValue: false,
          description: "Reset conversation history each pipeline run",
        },
      ],
    },
    {
      type: "example_node",
      label: "Examples (Few-Shot)",
      description: "Add examples for few-shot learning",
      category: "genai",
      icon: FileText,
      color: "#F59E0B",
      defaultConfig: {
        examples: [{ userInput: "", expectedOutput: "" }],
      },
      configFields: [
        {
          name: "examples",
          label: "Examples",
          type: "custom",
          description: "Add multiple input/output examples",
        },
      ],
    },
  ],
};

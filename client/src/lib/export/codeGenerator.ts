/**
 * Core code generator — walks the canvas DAG and assembles Python code.
 *
 * Reads nodes + edges from the Zustand store, topologically sorts them,
 * maps each node to a Python code template, deduplicates imports, and
 * returns the full assembled source.
 */

import type { Node, Edge } from "@xyflow/react";
import type { BaseNodeData, NodeType } from "../../types/pipeline";
import type { CodeBlock, GeneratedPipeline } from "./types";
import { VARIABLE_PREFIXES } from "./types";
import { NODE_TEMPLATES, SKIP_NODE_TYPES } from "./nodeTemplates";

// ─── Topological Sort ────────────────────────────────────────────

function topologicalSort(
  nodes: Node<BaseNodeData>[],
  edges: Edge[],
): Node<BaseNodeData>[] {
  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach((node) => {
    adjList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  edges.forEach((edge) => {
    adjList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });

  const sorted: Node<BaseNodeData>[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find((n) => n.id === nodeId);
    if (node) sorted.push(node);

    adjList.get(nodeId)?.forEach((neighbor) => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    });
  }

  return sorted;
}

// ─── Variable Name Assignment ────────────────────────────────────

/**
 * Builds a map of nodeId → Python variable name.
 *
 * Uses VARIABLE_PREFIXES for readable names. If multiple nodes share
 * the same type, appends _2, _3, etc.
 */
function buildVariableMap(
  sortedNodes: Node<BaseNodeData>[],
): Record<string, string> {
  const varMap: Record<string, string> = {};
  const usedCounts: Record<string, number> = {};

  for (const node of sortedNodes) {
    const nodeType = node.data.type as NodeType;
    const prefix = VARIABLE_PREFIXES[nodeType] || "result";

    usedCounts[prefix] = (usedCounts[prefix] || 0) + 1;
    const count = usedCounts[prefix];

    varMap[node.id] = count === 1 ? prefix : `${prefix}_${count}`;
  }

  return varMap;
}

// ─── Find Parent Variable ────────────────────────────────────────

/**
 * Given a node, find the variable name of its immediate upstream
 * (parent) node by looking at incoming edges.
 *
 * For split nodes, we need to resolve to the last dataset variable.
 * For metric nodes connected to model nodes, we don't need a data variable.
 */
function getParentVariable(
  nodeId: string,
  edges: Edge[],
  varMap: Record<string, string>,
  sortedNodes: Node<BaseNodeData>[],
): string | null {
  // Find all source nodes that connect to this node
  const incomingEdges = edges.filter((e) => e.target === nodeId);
  if (incomingEdges.length === 0) return null;

  const parentIds = incomingEdges.map((e) => e.source);

  for (const parentId of parentIds) {
    const parentNode = sortedNodes.find((n) => n.id === parentId);
    if (!parentNode) continue;

    const parentType = parentNode.data.type as NodeType;

    // Skip through noop/view nodes that produce no code — trace to their parent instead
    if (SKIP_NODE_TYPES.has(parentType)) {
      const grandparent = getParentVariable(parentId, edges, varMap, sortedNodes);
      if (grandparent) return grandparent;
      continue;
    }

    return varMap[parentId];
  }

  return parentIds[0] ? varMap[parentIds[0]] : null;
}

// ─── Resolve the "current dataframe" variable for split ──────────

/**
 * The split node needs to know which dataframe to split.
 * We trace back through the DAG to find the last dataset-producing node.
 */
function resolveDataframeForSplit(
  nodeId: string,
  edges: Edge[],
  varMap: Record<string, string>,
  sortedNodes: Node<BaseNodeData>[],
): string {
  const incomingEdges = edges.filter((e) => e.target === nodeId);
  for (const edge of incomingEdges) {
    const parentNode = sortedNodes.find((n) => n.id === edge.source);
    if (!parentNode) continue;

    const parentType = parentNode.data.type as NodeType;

    // Skip through noop/view nodes — trace to their code-producing ancestor
    if (SKIP_NODE_TYPES.has(parentType)) {
      return resolveDataframeForSplit(parentNode.id, edges, varMap, sortedNodes);
    }

    return varMap[parentNode.id];
  }
  return "df";
}

// ─── Main Generator ──────────────────────────────────────────────

export function generatePipeline(
  nodes: Node<BaseNodeData>[],
  edges: Edge[],
): GeneratedPipeline {
  // 1. Topological sort
  const sorted = topologicalSort(nodes, edges);

  // 2. Build variable map
  const varMap = buildVariableMap(sorted);

  // 3. Generate code blocks for each node
  const allBlocks: CodeBlock[] = [];
  const allImports: string[] = [];

  for (const node of sorted) {
    const nodeType = node.data.type as NodeType;

    // Skip view/utility nodes
    if (SKIP_NODE_TYPES.has(nodeType)) continue;

    const template = NODE_TEMPLATES[nodeType];
    if (!template) continue;

    const config = node.data.config || {};
    const outputVar = varMap[node.id];
    let inputVar = getParentVariable(
      node.id,
      edges,
      varMap,
      sorted,
    );

    // Special handling: split node needs to reference the actual dataframe variable
    if (nodeType === "split") {
      const dfVar = resolveDataframeForSplit(
        node.id,
        edges,
        varMap,
        sorted,
      );
      // We patch the split template to use this var as "df_pipeline"
      // The split template uses df_pipeline internally
      const block = template(config, outputVar, inputVar);
      // Replace df_pipeline with actual var
      block.code = block.code.replace(/df_pipeline/g, dfVar);
      allBlocks.push(block);
      allImports.push(...block.imports);
      continue;
    }

    const block = template(config, outputVar, inputVar);

    // Skip empty blocks
    if (!block.code && !block.comment) continue;

    allBlocks.push(block);
    allImports.push(...block.imports);
  }

  // 4. Deduplicate imports
  const uniqueImports = [...new Set(allImports)].sort();

  // 5. Assemble Python source
  const pythonSource = assemblePythonSource(uniqueImports, allBlocks);

  return {
    imports: uniqueImports,
    blocks: allBlocks,
    pythonSource,
  };
}

// ─── Source Assembly ─────────────────────────────────────────────

function assemblePythonSource(
  imports: string[],
  blocks: CodeBlock[],
): string {
  const lines: string[] = [];

  // Header
  lines.push('"""');
  lines.push("ML Pipeline");
  lines.push("Generated by Flow ML");
  lines.push('"""');
  lines.push("");

  // Imports
  if (imports.length > 0) {
    lines.push(...imports);
    lines.push("");
  }

  // Code blocks with section separators
  for (const block of blocks) {
    if (!block.code) continue;

    // Section comment
    if (block.comment) {
      const title = block.comment.replace(/^#+\s*/, "");
      lines.push(`# ${"─".repeat(2)} ${title} ${"─".repeat(Math.max(1, 52 - title.length))}`);
    }

    lines.push(block.code);
    lines.push("");
  }

  return lines.join("\n");
}

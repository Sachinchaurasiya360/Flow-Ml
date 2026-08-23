/**
 * API functions for ML Pipeline execution
 */

import apiClient from "../../lib/axios";
import { env } from "../../lib/env";
import type {
  NodeExecuteRequest,
  NodeExecuteResponse,
  PipelineExecuteRequest,
  PipelineExecuteResponse,
  PipelineStreamEvent,
  PipelineStreamCallbacks,
} from "../../types/pipeline";

/**
 * Execute pipeline with Server-Sent Events (SSE) streaming
 * Returns a cleanup function to close the EventSource connection
 */
export const executePipelineStream = async (
  request: PipelineExecuteRequest,
  callbacks: PipelineStreamCallbacks,
): Promise<() => void> => {
  return new Promise((resolve, reject) => {
    // Get auth token from axios instance
    const token = localStorage.getItem("access_token");

    // Create EventSource URL with auth token as query param (SSE doesn't support headers)
    // Use window.location.origin as base so relative API_URL paths resolve correctly
    const url = new URL(`${env.API_URL}/ml/pipeline/run/stream`, window.location.origin);

    // Use fetch to send POST request and get readable stream
    const abortController = new AbortController();

    fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: JSON.stringify(request),
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("Response body is not readable");
        }

        // Resolve with cleanup function immediately
        resolve(() => {
          abortController.abort();
          reader.cancel().catch(() => {});
        });

        // Read stream
        try {
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            // Decode chunk
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages
            const messages = buffer.split("\n\n");
            buffer = messages.pop() || ""; // Keep incomplete message in buffer

            for (const message of messages) {
              if (!message.trim() || !message.startsWith("data: ")) {
                continue;
              }

              try {
                const jsonStr = message.replace(/^data: /, "");
                const event = JSON.parse(jsonStr) as PipelineStreamEvent;

                // Route event to appropriate callback
                switch (event.event) {
                  case "node_started":
                    callbacks.onNodeStarted?.(event);
                    break;
                  case "node_completed":
                    callbacks.onNodeCompleted?.(event);
                    break;
                  case "node_failed":
                    callbacks.onNodeFailed?.(event);
                    break;
                  case "pipeline_completed":
                    callbacks.onPipelineCompleted?.(event);
                    break;
                  case "pipeline_failed":
                    callbacks.onPipelineFailed?.(event);
                    break;
                }
              } catch (error) {
                console.error("Error parsing SSE event:", error);
                callbacks.onError?.(error as Error);
              }
            }
          }
        } catch (readError) {
          // Ignore AbortError from intentional stream cancellation
          if ((readError as Error).name !== "AbortError") {
            throw readError;
          }
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          // Intentional abort — not an error
        } else {
          console.error("SSE stream error:", error);
          callbacks.onError?.(error);
          reject(error);
        }
      });
  });
};

export const pipelineApi = {
  /**
   * Execute a single node
   */
  executeNode: async (
    request: NodeExecuteRequest,
  ): Promise<NodeExecuteResponse> => {
    const response = await apiClient.post<NodeExecuteResponse>(
      "/ml/nodes/run",
      request,
    );
    return response.data;
  },

  /**
   * Execute a complete pipeline
   */
  executePipeline: async (
    request: PipelineExecuteRequest,
  ): Promise<PipelineExecuteResponse> => {
    const response = await apiClient.post<PipelineExecuteResponse>(
      "/ml/pipeline/run",
      request,
    );
    return response.data;
  },

  /**
   * Validate a node configuration (dry run)
   */
  validateNode: async (
    request: NodeExecuteRequest,
  ): Promise<NodeExecuteResponse> => {
    const response = await apiClient.post<NodeExecuteResponse>(
      "/ml/nodes/run",
      {
        ...request,
        dry_run: true,
      },
    );
    return response.data;
  },

  /**
   * Validate a pipeline (dry run)
   */
  validatePipeline: async (
    request: PipelineExecuteRequest,
  ): Promise<PipelineExecuteResponse> => {
    const response = await apiClient.post<PipelineExecuteResponse>(
      "/ml/pipeline/run",
      {
        ...request,
        dry_run: true,
      },
    );
    return response.data;
  },
};

// Named exports for convenience
export const executePipeline = pipelineApi.executePipeline;
export const executeNode = pipelineApi.executeNode;
export const validatePipeline = pipelineApi.validatePipeline;
export const validateNode = pipelineApi.validateNode;

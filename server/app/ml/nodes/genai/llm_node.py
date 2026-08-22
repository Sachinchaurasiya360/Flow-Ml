"""
LLM Node implementation.
LLM node powered by DynaRoute.
"""

from typing import Dict, Any, List
from pydantic import Field

from app.ml.nodes.genai.base import GenAIBaseNode, GenAINodeInput, GenAINodeOutput, ProviderConfig
from app.ml.providers import ProviderFactory, Message


class LLMNode(GenAIBaseNode):
    """
    LLM Node - calls language models with unified interface.

    Config:
        provider: "dynaroute"
        model: "auto"
        temperature: 0.0-2.0
        maxTokens: Max output tokens
        topP: Nucleus sampling
        frequencyPenalty: -2.0 to 2.0
        presencePenalty: -2.0 to 2.0
        stopSequences: List of stop sequences
        useOwnApiKey: If True, use student's API key
        apiKeyRef: Reference to APISecret.id
        stream: Enable streaming (if supported)

    Input:
        messages: List of {role, content} messages
        OR
        prompt: Single user prompt (will be converted to messages)
        systemPrompt: Optional system message

    Output:
        response: Generated text
        model: Model used
        provider: Provider used
    """

    node_type = "llm"

    def _parse_provider_config(self, config: Dict[str, Any]) -> ProviderConfig:
        """Parse LLM config."""
        return ProviderConfig(
            provider="dynaroute",
            model="auto",
            temperature=config.get("temperature", 0.7),
            maxTokens=config.get("maxTokens", 1000),
            topP=config.get("topP", 1.0),
            frequencyPenalty=config.get("frequencyPenalty", 0.0),
            presencePenalty=config.get("presencePenalty", 0.0),
            stopSequences=config.get("stopSequences"),
            apiKey=None,  # Will be fetched later
        )

    async def _execute_genai(self, input_data: GenAINodeInput) -> GenAINodeOutput:
        """Execute LLM call."""
        data = input_data.data

        # Parse input messages
        messages = self._parse_messages(data)

        if not messages:
            return GenAINodeOutput(
                node_type=self.node_type,
                execution_time_ms=0,
                success=False,
                error="No messages provided",
                data={},
            )

        # Create provider
        try:
            provider = ProviderFactory.create(self.provider_config.provider)
        except ValueError as e:
            return GenAINodeOutput(
                node_type=self.node_type,
                execution_time_ms=0,
                success=False,
                error=str(e),
                data={},
            )

        # Generate completion
        try:
            response = await provider.generate(
                messages=messages,
                model=self.provider_config.model,
                temperature=self.provider_config.temperature,
                max_tokens=self.provider_config.maxTokens,
                top_p=self.provider_config.topP,
                frequency_penalty=self.provider_config.frequencyPenalty,
                presence_penalty=self.provider_config.presencePenalty,
                stop_sequences=self.provider_config.stopSequences,
            )
        except Exception as e:
            return GenAINodeOutput(
                node_type=self.node_type,
                execution_time_ms=0,
                success=False,
                error=f"LLM API error: {str(e)}",
                data={},
            )

        return GenAINodeOutput(
            node_type=self.node_type,
            execution_time_ms=0,
            success=True,
            data={
                "response": response.content,
                "messages": [msg.dict() for msg in messages]
                + [{"role": "assistant", "content": response.content}],
                "finishReason": response.finishReason,
            },
            provider=self.provider_config.provider,
            model=self.provider_config.model,
            responseMetadata=response.metadata,
        )

    def _parse_messages(self, data: Dict[str, Any]) -> List[Message]:
        """
        Parse input data into messages.

        Supports:
        1. messages: [{role, content}, ...]
        2. prompt + systemPrompt
        """
        messages = []

        # Option 1: Explicit messages array
        if "messages" in data:
            for msg in data["messages"]:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    messages.append(Message(role=msg["role"], content=msg["content"]))
            return messages

        # Option 2: Simple prompt + system
        if "systemPrompt" in data:
            messages.append(Message(role="system", content=data["systemPrompt"]))

        if "prompt" in data:
            messages.append(Message(role="user", content=data["prompt"]))

        # Option 3: Inherit from previous node's messages
        if "previousMessages" in data:
            for msg in data["previousMessages"]:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    messages.append(Message(role=msg["role"], content=msg["content"]))

        return messages

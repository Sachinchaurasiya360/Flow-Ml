"""
LLM Provider abstraction layer.
Unified interface for OpenAI, Anthropic, Gemini, and DynaRoute.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, AsyncGenerator
from pydantic import BaseModel
import os
import asyncio
from functools import partial
from app.core.config import settings
from app.core.logging import logger


class Message(BaseModel):
    """Chat message."""

    role: str  # "system", "user", "assistant"
    content: str


class LLMResponse(BaseModel):
    """Unified LLM response."""

    content: str
    tokensUsed: int
    inputTokens: int
    outputTokens: int
    finishReason: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class BaseLLMProvider(ABC):
    """Base class for LLM providers."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize provider."""
        self.api_key = api_key or self._get_default_api_key()

    @abstractmethod
    def _get_default_api_key(self) -> Optional[str]:
        """Get default API key from environment."""
        pass

    @abstractmethod
    async def generate(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> LLMResponse:
        """Generate completion."""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion."""
        pass


class OpenAIProvider(BaseLLMProvider):
    """OpenAI API provider."""

    def _get_default_api_key(self) -> Optional[str]:
        """Get OpenAI API key from settings."""
        return settings.OPENAI_API_KEY

    async def generate(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> LLMResponse:
        """Generate completion using OpenAI."""
        try:
            from openai import AsyncOpenAI
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

        client = AsyncOpenAI(api_key=self.api_key)

        # Convert messages to OpenAI format
        openai_messages = [{"role": msg.role, "content": msg.content} for msg in messages]

        # Call API
        response = await client.chat.completions.create(
            model=model,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=kwargs.get("top_p", 1.0),
            frequency_penalty=kwargs.get("frequency_penalty", 0.0),
            presence_penalty=kwargs.get("presence_penalty", 0.0),
            stop=kwargs.get("stop_sequences"),
        )

        choice = response.choices[0]

        return LLMResponse(
            content=choice.message.content or "",
            tokensUsed=response.usage.total_tokens,
            inputTokens=response.usage.prompt_tokens,
            outputTokens=response.usage.completion_tokens,
            finishReason=choice.finish_reason,
            metadata={
                "model": response.model,
                "id": response.id,
            },
        )

    async def generate_stream(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion using OpenAI."""
        try:
            from openai import AsyncOpenAI
        except ImportError:
            raise ImportError("openai package not installed. Run: pip install openai")

        client = AsyncOpenAI(api_key=self.api_key)

        openai_messages = [{"role": msg.role, "content": msg.content} for msg in messages]

        stream = await client.chat.completions.create(
            model=model,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
            top_p=kwargs.get("top_p", 1.0),
            frequency_penalty=kwargs.get("frequency_penalty", 0.0),
            presence_penalty=kwargs.get("presence_penalty", 0.0),
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude API provider."""

    def _get_default_api_key(self) -> Optional[str]:
        """Get Anthropic API key from settings."""
        return settings.ANTHROPIC_API_KEY

    async def generate(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> LLMResponse:
        """Generate completion using Anthropic."""
        try:
            from anthropic import AsyncAnthropic
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")

        client = AsyncAnthropic(api_key=self.api_key)

        # Anthropic requires system message separate
        system_message = None
        conversation_messages = []

        for msg in messages:
            if msg.role == "system":
                system_message = msg.content
            else:
                conversation_messages.append({"role": msg.role, "content": msg.content})

        # Call API
        response = await client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_message,
            messages=conversation_messages,
            top_p=kwargs.get("top_p", 1.0),
            stop_sequences=kwargs.get("stop_sequences"),
        )

        return LLMResponse(
            content=response.content[0].text,
            tokensUsed=response.usage.input_tokens + response.usage.output_tokens,
            inputTokens=response.usage.input_tokens,
            outputTokens=response.usage.output_tokens,
            finishReason=response.stop_reason,
            metadata={
                "model": response.model,
                "id": response.id,
            },
        )

    async def generate_stream(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion using Anthropic."""
        try:
            from anthropic import AsyncAnthropic
        except ImportError:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")

        client = AsyncAnthropic(api_key=self.api_key)

        system_message = None
        conversation_messages = []

        for msg in messages:
            if msg.role == "system":
                system_message = msg.content
            else:
                conversation_messages.append({"role": msg.role, "content": msg.content})

        async with client.messages.stream(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_message,
            messages=conversation_messages,
        ) as stream:
            async for text in stream.text_stream:
                yield text


class GeminiProvider(BaseLLMProvider):
    """Google Gemini API provider."""

    def _get_default_api_key(self) -> Optional[str]:
        """Get Gemini API key from settings."""
        return settings.GEMINI_API_KEY

    async def generate(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> LLMResponse:
        """Generate completion using Gemini."""
        try:
            from google import genai
        except ImportError:
            raise ImportError("google-genai package not installed. Run: pip install google-genai")

        if not self.api_key:
            raise ValueError("Gemini API key is not configured")

        client = genai.Client(api_key=self.api_key)

        # Convert messages to simple text format
        contents = "\n".join([f"{msg.role}: {msg.content}" for msg in messages])

        # Generate content
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, partial(client.models.generate_content, model=model, contents=contents)
        )

        # Extract text
        response_text = response.text

        # Estimate tokens
        input_tokens = len(contents) // 4
        output_tokens = len(response_text) // 4

        return LLMResponse(
            content=response_text,
            tokensUsed=input_tokens + output_tokens,
            inputTokens=input_tokens,
            outputTokens=output_tokens,
            finishReason=None,
            metadata={"model": model},
        )

    async def generate_stream(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion using Gemini."""
        try:
            from google import genai
        except ImportError:
            raise ImportError("google-genai package not installed. Run: pip install google-genai")

        if not self.api_key:
            raise ValueError("Gemini API key is not configured")

        client = genai.Client(api_key=self.api_key)

        # Convert messages to simple text format
        contents = "\n".join([f"{msg.role}: {msg.content}" for msg in messages])

        # Generate content (non-streaming fallback)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, partial(client.models.generate_content, model=model, contents=contents)
        )

        yield response.text


class DynaRouteProvider(BaseLLMProvider):
    """DynaRoute API provider - intelligent model routing."""

    def _get_default_api_key(self) -> Optional[str]:
        """Get DynaRoute API key from settings."""
        return settings.DYNAROUTE_API_KEY

    async def generate(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> LLMResponse:
        """Generate completion using DynaRoute."""
        try:
            from dynaroute import DynaRouteClient
        except ImportError:
            raise ImportError(
                "dynaroute-client package not installed. Run: pip install dynaroute-client"
            )

        if not self.api_key:
            raise ValueError("DynaRoute API key is not configured")

        client = DynaRouteClient(api_key=self.api_key)

        # Convert messages to DynaRoute format
        dynaroute_messages = [{"role": msg.role, "content": msg.content} for msg in messages]

        # Run synchronous client.chat in thread pool
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, partial(client.chat, messages=dynaroute_messages)
        )

        # Extract response
        if not response or "choices" not in response or not response["choices"]:
            raise ValueError("DynaRoute returned invalid response")

        content = response["choices"][0].get("message", {}).get("content", "")

        # Extract token usage
        usage = response.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        total_tokens = usage.get("total_tokens", input_tokens + output_tokens)

        return LLMResponse(
            content=content,
            tokensUsed=total_tokens,
            inputTokens=input_tokens,
            outputTokens=output_tokens,
            finishReason=response["choices"][0].get("finish_reason"),
            metadata={
                "model": response.get("model", "dynaroute"),
                "id": response.get("id"),
            },
        )

    async def generate_stream(
        self,
        messages: List[Message],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion using DynaRoute."""
        try:
            from dynaroute import DynaRouteClient
        except ImportError:
            raise ImportError(
                "dynaroute-client package not installed. Run: pip install dynaroute-client"
            )

        if not self.api_key:
            raise ValueError("DynaRoute API key is not configured")

        client = DynaRouteClient(api_key=self.api_key)
        dynaroute_messages = [{"role": msg.role, "content": msg.content} for msg in messages]

        # Get streaming response
        stream = client.chat(messages=dynaroute_messages, stream=True)

        # Iterate through stream chunks
        loop = asyncio.get_event_loop()
        for chunk in stream:
            # Yield control to event loop periodically
            await asyncio.sleep(0)

            content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
            if content:
                yield content


class ProviderFactory:
    """Factory for creating LLM providers."""

    _providers: Dict[str, type[BaseLLMProvider]] = {"dynaroute": DynaRouteProvider}

    @classmethod
    def create(cls, provider: str, api_key: Optional[str] = None) -> BaseLLMProvider:
        """
        Create LLM provider instance.

        Args:
            provider: Provider name (openai, anthropic, huggingface)
            api_key: Optional API key override

        Returns:
            Provider instance

        Raises:
            ValueError: If provider not supported
        """
        provider_lower = provider.lower()

        if provider_lower not in cls._providers:
            raise ValueError(
                f"Unsupported provider: {provider}. "
                f"Supported: {', '.join(cls._providers.keys())}"
            )

        provider_class = cls._providers[provider_lower]
        return provider_class(api_key=api_key)

    @classmethod
    def register_provider(cls, name: str, provider_class: type[BaseLLMProvider]):
        """Register a custom provider."""
        cls._providers[name.lower()] = provider_class

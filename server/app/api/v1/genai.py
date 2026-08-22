"""GenAI chat endpoint powered exclusively by DynaRoute."""

import asyncio
import json
from functools import partial
from typing import Any, Dict, List, Optional

from dynaroute import APIError, DynaRouteClient
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/genai", tags=["genai"])


class ChatRequest(BaseModel):
    message: str
    systemPrompt: Optional[str] = None
    examples: Optional[List[Dict[str, Any]]] = None


@router.post("/chat")
async def chat_stream(request: ChatRequest):
    """Stream a response using the server-configured DynaRoute API key."""

    async def generate():
        try:
            if not settings.DYNAROUTE_API_KEY:
                yield f"data: {json.dumps({'error': 'DynaRoute API key is not configured'})}\n\n"
                return

            messages = []
            if request.systemPrompt:
                messages.append({"role": "system", "content": request.systemPrompt})

            for example in request.examples or []:
                if example.get("userInput") and example.get("expectedOutput"):
                    messages.append({"role": "user", "content": example["userInput"]})
                    messages.append({"role": "assistant", "content": example["expectedOutput"]})

            messages.append({"role": "user", "content": request.message})
            client = DynaRouteClient(api_key=settings.DYNAROUTE_API_KEY)
            loop = asyncio.get_running_loop()
            stream = await loop.run_in_executor(
                None, partial(client.chat, messages=messages, stream=True)
            )

            for chunk in stream:
                content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                if content:
                    yield f"data: {json.dumps({'content': content})}\n\n"

            yield f"data: {json.dumps({'done': True})}\n\n"
        except APIError as error:
            logger.exception(f"DynaRoute API error: {error}")
            yield f"data: {json.dumps({'error': str(error)})}\n\n"
        except Exception as error:
            logger.exception(f"Streaming error: {error}")
            yield f"data: {json.dumps({'error': str(error)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

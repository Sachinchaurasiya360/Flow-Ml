"""
Standalone diagnostic script for the Inworld TTS API.
Run with: uv run python scripts/test_inworld_tts.py
"""

import os
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

# Load server/.env regardless of cwd
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

API_KEY = os.getenv("INWORLD_API_KEY", "")
WORKSPACE_ID = os.getenv("INWORLD_WORKSPACE_ID", "")
VOICE_ID = "default-tdxiowf-g_jzcmgci-i_iw__rajat_sir_voice_clone"
URL = "https://api.inworld.ai/tts/v1/voice:stream"


def main() -> int:
    print(f"API key set:      {bool(API_KEY)} (len={len(API_KEY)})")
    print(f"Workspace ID:     {WORKSPACE_ID!r}")
    print(f"Voice ID used:    {VOICE_ID!r}")

    if not API_KEY:
        print("\n❌ INWORLD_API_KEY is empty in server/.env — cannot call the API.")
        return 1

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {API_KEY}",
    }
    payload = {
        "text": "Hello, this is a test of the Inworld text to speech API.",
        "voice_id": VOICE_ID,
        "model_id": "inworld-tts-1.5-mini",
        "audio_config": {
            "audio_encoding": "OGG_OPUS",
            "sample_rate_hertz": 24000,
            "bit_rate": 32000,
        },
    }

    print(f"\nPOST {URL}")
    try:
        response = httpx.post(URL, headers=headers, json=payload, timeout=30.0)
    except httpx.HTTPError as e:
        print(f"\n❌ Request failed: {e}")
        return 1

    print(f"Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Body:\n{response.text}")
        return 1

    body_preview = response.text[:500]
    print(f"\n✅ 200 OK. Response preview:\n{body_preview}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

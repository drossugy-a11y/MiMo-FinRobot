import httpx
from typing import Optional, Dict, Any
from ..core.config import settings


class MiMoClient:
    def __init__(self):
        self.api_key = settings.MIMO_API_KEY
        self.base_url = settings.MIMO_API_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat_completion(
        self,
        model: str,
        messages: list[Dict[str, str]],
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            return response.json()

    async def analyze_image(
        self,
        image_base64: str,
        prompt: str = "请分析这张图片中的财务数据",
        max_tokens: int = 2048,
    ) -> Dict[str, Any]:
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_base64}"},
                    },
                ],
            }
        ]
        return await self.chat_completion(
            model=settings.MIMO_MODEL_OMNI,
            messages=messages,
            max_tokens=max_tokens,
        )

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 4096,
    ) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        result = await self.chat_completion(
            model=settings.MIMO_MODEL_PRO,
            messages=messages,
            max_tokens=max_tokens,
        )
        return result.get("choices", [{}])[0].get("message", {}).get("content", "")

    async def text_to_speech(
        self,
        text: str,
        voice: str = "alloy",
    ) -> bytes:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/audio/speech",
                headers=self.headers,
                json={
                    "model": settings.MIMO_MODEL_TTS,
                    "input": text,
                    "voice": voice,
                },
                timeout=120.0,
            )
            response.raise_for_status()
            return response.content


mimo_client = MiMoClient()

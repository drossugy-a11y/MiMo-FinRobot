import pytest
from unittest.mock import AsyncMock, patch
from app.services.mimo_client import MiMoClient


def test_mimo_client_init():
    client = MiMoClient()
    assert client.base_url is not None
    assert client.headers is not None
    assert "Authorization" in client.headers


@pytest.mark.asyncio
async def test_chat_completion():
    client = MiMoClient()

    mock_response = AsyncMock()
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "测试回复"}}]
    }
    mock_response.raise_for_status = AsyncMock()

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        result = await client.chat_completion(
            model="test-model",
            messages=[{"role": "user", "content": "测试"}],
        )
        assert result["choices"][0]["message"]["content"] == "测试回复"


@pytest.mark.asyncio
async def test_generate_text():
    client = MiMoClient()

    mock_response = AsyncMock()
    mock_response.json.return_value = {
        "choices": [{"message": {"content": "生成的文本"}}]
    }
    mock_response.raise_for_status = AsyncMock()

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        result = await client.generate_text(
            prompt="测试提示",
            system_prompt="系统提示",
        )
        assert result == "生成的文本"

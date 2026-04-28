from typing import Dict, Any, Optional
from .mimo_client import mimo_client
from ..core.config import settings


class ReportGeneratorService:
    def __init__(self):
        self.client = mimo_client

    async def generate_strategy_analysis(
        self, financial_data: Dict[str, Any]
    ) -> str:
        system_prompt = """你是一位资深的量化投资分析师。
基于提供的财务数据，生成一份详细的投资策略分析报告。
报告应该包含：
1. 公司基本面分析
2. 技术面分析
3. 风险评估
4. 投资建议和策略"""

        prompt = f"""基于以下财务数据，生成投资策略分析：

公司信息：{financial_data.get('company_name', '未知')}
报告期间：{financial_data.get('period', '未知')}

财务指标：
{financial_data.get('metrics', '暂无')}

分析内容：
{financial_data.get('analysis', '暂无')}

请生成一份专业的投资策略分析报告，使用Markdown格式。"""

        return await self.client.generate_text(
            prompt=prompt,
            system_prompt=system_prompt,
            max_tokens=settings.MAX_TOKENS_PRO,
        )

    async def generate_report_summary(self, full_report: str) -> str:
        system_prompt = "你是一位专业的金融报告撰写者，擅长将复杂的分析内容总结为简洁易懂的报告。"

        prompt = f"""请将以下投资分析报告总结为一份简洁的研报摘要（500字以内）：

{full_report[:4000]}

要求：
1. 突出关键发现
2. 包含投资建议
3. 列出主要风险
4. 使用清晰的标题结构"""

        return await self.client.generate_text(
            prompt=prompt,
            system_prompt=system_prompt,
            max_tokens=1024,
        )

    async def extract_trading_signals(self, report_content: str) -> Dict[str, Any]:
        system_prompt = "你是一位量化交易策略专家，擅长从研报中提取可执行的交易信号。"

        prompt = f"""从以下研报中提取量化交易信号，返回JSON格式：

研报内容：
{report_content[:3000]}

返回格式：
{{
  "signals": [
    {{
      "symbol": "股票代码",
      "action": "buy/sell/hold",
      "confidence": 0.85,
      "reason": "信号原因"
    }}
  ],
  "risk_level": "low/medium/high",
  "suggested_position_size": 0.1
}}"""

        result = await self.client.generate_text(
            prompt=prompt,
            system_prompt=system_prompt,
            max_tokens=1024,
        )

        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return {"signals": [], "risk_level": "medium", "suggested_position_size": 0.1}

    async def generate_audio_briefing(self, report_content: str) -> bytes:
        briefing_prompt = f"""请将以下研报内容转化为一段2分钟以内的语音简报脚本：

{report_content[:2000]}

要求：
1. 口语化表达
2. 突出重点数据
3. 给出清晰结论"""

        script = await self.client.generate_text(
            prompt=briefing_prompt,
            system_prompt="你是一位财经主播，擅长将专业内容转化为通俗易懂的口语表达。",
            max_tokens=512,
        )

        audio = await self.client.text_to_speech(script)
        return audio


report_generator = ReportGeneratorService()
